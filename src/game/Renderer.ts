import {Line} from '@laser-dac/draw';
import {World} from './World';
import {Vector} from './Vector';
import {Scene} from '../draw/Scene';
import {ResolutionScaler} from '../draw/ResolutionScaler';
import {DrawableObject} from './drawing/DrawableObject';

export interface RendererOptions {
  scene: Scene;
  world: World;
}

export interface RendererRenderOptions {
  extraObjects?: DrawableObject[];
}

export class Renderer {
  private readonly scene: Scene;
  private readonly world: World;
  private lastPoint: Vector;

  constructor(options: RendererOptions) {
    this.scene = options.scene;
    this.world = options.world;
    this.lastPoint = {x: 0, y: 0};
  }

  render(options?: RendererRenderOptions): void {
    this.world.getObjects().forEach((object) => {
      this.renderObject(object);
    });

    if (
      typeof options !== 'undefined' &&
      typeof options.extraObjects !== 'undefined'
    ) {
      options.extraObjects.forEach((object) => this.renderObject(object));
    }
  }

  private renderObject(object: DrawableObject): void {
    const drawData = object.draw();

    if (drawData.firstPos !== undefined) {
      this.scene.add(
        new ResolutionScaler(
          new Line({
            from: this.lastPoint,
            to: drawData.firstPos,
            color: [0, 0, 0],
          }),
          0.75
        )
      );
      this.lastPoint = drawData.firstPos;
    }

    drawData.shapes.forEach((shape) => {
      this.scene.add(shape);
    });

    if (drawData.lastPos !== undefined) {
      this.lastPoint = drawData.lastPos;
    }
  }
}
