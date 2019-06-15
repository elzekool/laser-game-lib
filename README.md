# Laser Game Library

A simple library to use with @laser-dac suite of libraries to ease the development of games.
It is not a full gaming library but it should be easy to incorporate them.

**NOTE: This is an alpha state package, expect a lot of breaking changes!**

## General

### Vector and Bounds

Two key types are used in this library: `Vector` and `Bounds`.

A `Vector` describes a cartesian coordinate. An example:

```js
const vector = {x: 0.1, y: 0.2};
```

`Bounds` describe the rectangular bounds of an object. It describes this by the vectors of the top-left and
bottom-right corners. An example:

```js
const bounds = {
  topLeft: {x: 0.2, y: 0.2},
  bottomRight: {x: 0.8, y: 0.8},
};
```

### Game Objects

Every object should implement `DrawableObject`, this basically means that it should have a `draw()` function that
returns a list of shapes. When possible it should also return the first and last point drawn. This is to optimize
the paths between the objects.

```js
import {Line} from '@laser-dac/draw';

export class ExampleObject {
  draw() {
    return {
      firstPos: {x: 0.0, y: 0.0},
      lastPos: {x: 1.0, y: 1.0},
      shapes: [
        new Line({
          from: {x: 0.0, y: 0.1},
          to: {x: 1.0, y: 1.0},
          color: [1, 0, 0],
        }),
      ],
    };
  }
}
```

### World

The `World` is where all objects are added to. A world has bounds that can be used to automatically remove
objects that are outside the world. The world also save the ticks per second. This is used to determine
the correct movement in relation to object velocity and gravity.

```js
import {World} from '@elzekool/laser-game-lib/game';

const world = new World({
  bounds: {
    topLeft: {x: 0.0, y: 0.0},
    bottomRight: {x: 1.0, y: 1.0},
  },
  ticksPerSecond: 30,
});
```

You can then use `World.addObject()`, `World.deleteObject()` and `World.clearObjects()` to manipulate the objects in
this world.

### Rendering

You can use the `Renderer` to render all objects in the `World` on a `Scene`. An example:

```js
import {Renderer} from '@elzekool/laser-game-lib/game';

//... create a world, scene, etc.

const renderer = new Renderer({
  world,
  scene,
});

scene.start(renderer.render);
```

### Game

The `Game` interface is the interface where you implement your game in. You are required to
implement two methods: `update()` is called in a regular interval to allow you to update the
game state. `render(renderer: Renderer)` is also called in a regular interval and is the place where you render your
game. You are provided with a `Renderer` instance to help you with this.

As many games also require input/output WebSocket functionality is available. Therefor you can implement three different
and optional functions: `onMessage(message: string)` is called when a new WebSocket message is received.
`getMessage(): string | null` is called regularly and when it returns a string this is send to all connected clients.
To send a message when a new client connects you can implement `getWelcomeMessage(): string | null`. Note that the
library doesn't do any encode/decoding of the messages.

```js
class ExampleGame {
  update() {
    // Update game state
  }

  render(renderer) {
    renderer.render();
  }
}
```

### Game runner

To easely use all the elements in this library you can use the `GameRunner`. This will create a `World`, `Renderer`,
`Game` and will initialize the `Device`s, web server and will start all updates.

```js
import {Simulator} from "@laser-dac/simulator";
import {GameRunner} from '@elzekool/laser-game-lib';
import * as path from "path";

const gameRunner = new GameRunner({
    // Provide the root path of your web frontend
    webserverRootPath: path.join(__dirname, '/public'),

    // Provide the bounds of your world
    worldBounds: {
        topLeft: { x: 0, 0 },
        bottomRight: { x: 1.0, y: 1.0 }
    },

    // Provide the devices you want to use for rendering
    devices: [
        new Simulator()
    ],

    // Create a function that returns an instance of your game.
    gameFactory: (world => new ExampleGame(world))
});

// Actually start your game
gameRunner.start();

```

## Utilities

### Object Movement

To automate the movement of objects the `ObjectMover` can be used. It automatically moves all objects in the
`World` that adhere to the `MovingObject` interface (having `getPosition(): Vector`, `setPosition(position: Vector)`,
`getVelocity(): Vector`, `setVelocity(velocity: Vector)` and `getGravityFactor(): number` functions).

`velocity` is described as a direction vector. The value of this vector is the moment in 1 second.

When creating the `ObjectMover` you can provide a `gravity` vector. This vector multiplied by the object
`gravityFactor` is added on each iteration. Note that this is not a full physics engine, there is no bounce, etc.

An example how to use it:

```js
import {ObjectMover} from '@elzekool/game/movement';

class ObjectToMove {
  position = {x: 0, y: 1.0};
  velocity = {x: 0.1, y: -0.2};

  getPosition() {
    return this.position;
  }

  setPosition(position) {
    this.position = position;
  }

  getVelocity() {
    return this.velocity;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
  }

  getGravityFactor() {
    return 0.1;
  }

  draw() {
    return [
      //... shapes
    ];
  }
}

const objectMover = new ObjectMover({
  world,
  gravity: {x: 0, y: 0.1},
});

world.addObject(new ObjectToMove());

objectMover.moveObjects();
```

### Out Of Bounds Detection

When objects move they can get out-of-bounds. In that case you don't want to keep rendering them. To ease the
automatic removal of objects you can use the `OutOfBoundDetector`.

**TODO: Complete**

### Collision detection

**TODO: Complete**

### Drawing

The library contains a few utilities for drawing.

#### Resolution Scaler

`@laser-dac` shapes use the resolution of the `Scene` to determine the number of points to render. This number
represents the number of points rendered in a straight line from [0,0] to [1,0]. You can use the resolution scale
to change this resolution for a specific shape. An example how to use it:

```js
import {ResolutionScaler} from '@elzekool/laser-game-lib/draw/ResolutionScaler';
import {Line} from '@laser-dac/draw';

new ResolutionScaler(
  // Shape to render with modified resolution
  new Line({
    from: [ 0, 0 ],
    to: [ 1, 0 ]
    color: [0, 1, 0],
  }),

  // Resolution factor (0.5 will half the resolution)
  0.5
)
```
