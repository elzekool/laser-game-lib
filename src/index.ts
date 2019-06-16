import * as express from 'express';
import {Server as WebSocketServer} from 'ws';
import WebSocket = require('ws');
import * as http from 'http';

import {DAC, Device} from '@laser-dac/core';
import {Bounds} from './game/Bounds';
import {Game} from './game/Game';
import {World} from './game/World';
import {Scene} from './draw/Scene';
import {Renderer} from './game/Renderer';

const DEFAULT_PORT = 8321;
const DEFAULT_WORLD_BOUNDS: Bounds = {
  topLeft: {x: 0, y: 0},
  bottomRight: {x: 1.0, y: 1.0},
};
const DEFAULT_TICKS_PER_SECOND = 30;

export interface GameRunnerOptions {
  webserverRootPath: string;
  webSocketPort?: number;
  worldBounds?: Bounds;
  gameTicksPerSecond?: number;
  devices: Device[];
  resolution?: number;
  renderFramesPerSecond?: number;
  renderPointsPerSecond?: number;
  gameFactory: (world: World) => Game;
  sceneFactory?: (resolution?: number) => Scene;
  rendererFactory?: (world: World, scene: Scene) => Renderer;
}

export class GameRunner {
  private readonly webserverRootPath: string;
  private readonly webSockerPort: number;
  private readonly worldBounds: Bounds;
  private readonly gameTicksPerSecond: number;
  private readonly devices: Device[];
  private readonly resolution?: number;
  private readonly renderFramesPerSecond?: number;
  private readonly renderPointsPerSecond?: number;
  private readonly gameFactory: (world: World) => Game;
  private readonly sceneFactory?: (resolution?: number) => Scene;
  private readonly rendererFactory?: (world: World, scene: Scene) => Renderer;

  constructor(options: GameRunnerOptions) {
    this.webserverRootPath = options.webserverRootPath;
    this.webSockerPort = options.webSocketPort || DEFAULT_PORT;
    this.worldBounds = options.worldBounds || DEFAULT_WORLD_BOUNDS;
    this.gameTicksPerSecond =
      options.gameTicksPerSecond || DEFAULT_TICKS_PER_SECOND;
    this.devices = options.devices;
    this.resolution = options.resolution;
    this.renderFramesPerSecond = options.renderFramesPerSecond;
    this.renderPointsPerSecond = options.renderPointsPerSecond;
    this.gameFactory = options.gameFactory;
    this.sceneFactory = options.sceneFactory;
    this.rendererFactory = options.rendererFactory;
  }

  start() {
    const dac = new DAC();
    this.devices.forEach((device) => dac.use(device));

    const world = new World({
      bounds: this.worldBounds,
      ticksPerSecond: this.gameTicksPerSecond,
    });

    const scene =
      typeof this.sceneFactory !== 'undefined'
        ? this.sceneFactory(this.resolution)
        : new Scene({
            resolution: this.resolution,
          });

    const renderer =
      typeof this.rendererFactory !== 'undefined'
        ? this.rendererFactory(world, scene)
        : new Renderer({
            world,
            scene,
          });

    const game = this.gameFactory(world);

    (async () => {
      await dac.start();

      const server = http.createServer();
      const app = express();
      app.use(express.static(this.webserverRootPath));
      const wss = new WebSocketServer({server});

      server.on('request', app);
      server.listen(this.webSockerPort, () => {
        console.log(
          `Started interface on http://localhost:${this.webSockerPort}`
        );
      });

      const activeWebsocketConnections = new Set<WebSocket>();

      wss.on('connection', (ws: WebSocket) => {
        activeWebsocketConnections.add(ws);

        if (typeof game.getWelcomeMessage !== 'undefined') {
          const message = game.getWelcomeMessage();
          if (message !== null) {
            ws.send(message);
          }
        }

        ws.on('message', function incoming(message: any) {
          if (typeof game.onMessage !== 'undefined') {
            game.onMessage.apply(game, [message as string]);
          }
        });
      });

      wss.on('disconnect', (ws: WebSocket) => {
        activeWebsocketConnections.delete(ws);
      });

      setInterval(() => {
        game.update();
        if (typeof game.getMessage !== 'undefined') {
          const message = game.getMessage();
          if (message !== null) {
            activeWebsocketConnections.forEach((ws) => ws.send(message));
          }
        }
      }, 1000 / this.gameTicksPerSecond);

      scene.start(
        () => game.render.apply(game, [renderer]),
        this.renderFramesPerSecond
      );
      dac.stream(scene, this.renderPointsPerSecond);
    })().then(() => {
      // Ignore result, added to keep code check happy
    });
  }
}
