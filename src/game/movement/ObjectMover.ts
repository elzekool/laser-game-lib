import {Vector} from '../Vector';
import {World} from '../World';
import {isMovingObject, MovingObject} from './MovingObject';

export interface ObjectMoverOptions {
  world: World;
  gravity?: Vector;
  velocityTransformerFn?: (velocity: Vector, object: MovingObject) => Vector;
  gravityTransformerFn?: (gravity: Vector, object: MovingObject) => Vector;
}

export class ObjectMover {
  private readonly world: World;
  private readonly gravity?: Vector;
  private readonly velocityTransformerFn?: (
    velocity: Vector,
    object: MovingObject
  ) => Vector;
  private readonly gravityTransformerFn?: (
    gravity: Vector,
    object: MovingObject
  ) => Vector;

  constructor(options: ObjectMoverOptions) {
    this.world = options.world;
    this.gravity = options.gravity;
    this.velocityTransformerFn = options.velocityTransformerFn;
    this.gravityTransformerFn = options.gravityTransformerFn;
  }

  moveObjects(): void {
    const updateInterval = this.world.getUpdateInterval();

    this.world.getObjects().forEach((object) => {
      if (!isMovingObject(object)) {
        return;
      }

      const position = object.getPosition();
      const velocity = object.getVelocity();

      const appliedVelocity =
        typeof this.velocityTransformerFn !== 'undefined'
          ? this.velocityTransformerFn(velocity, object)
          : velocity;

      position.x += appliedVelocity.x / updateInterval;
      position.y += appliedVelocity.y / updateInterval;

      if (typeof this.gravity !== 'undefined') {
        const appliedGravity =
          typeof this.gravityTransformerFn !== 'undefined'
            ? this.gravityTransformerFn(this.gravity, object)
            : this.gravity;

        velocity.x +=
          (appliedGravity.x / updateInterval) * object.getGravityFactor();
        velocity.y +=
          (appliedGravity.y / updateInterval) * object.getGravityFactor();
      }

      object.setPosition(position);
      object.setVelocity(velocity);
    });
  }
}
