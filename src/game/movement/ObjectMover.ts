import {Vector} from "../Vector";
import {World} from "../World";
import {isMovingObject, MovingObject} from "./MovingObject";

export interface ObjectMoverOptions {
    world: World;
    updateInterval: number;
    gravity? : Vector;
    velocityTransformerFn?: (velocity: Vector, object: MovingObject) => Vector;
    gravityTransformerFn?: (gravity: Vector, object: MovingObject) => Vector;
}

export class ObjectMover
{
    private readonly world: World;
    private readonly gravity? : Vector;
    private readonly updateInterval: number;
    private readonly velocityTransformerFn?: (velocity: Vector, object: MovingObject) => Vector;
    private readonly gravityTransformerFn?: (gravity: Vector, object: MovingObject) => Vector;

    constructor(options: ObjectMoverOptions) {
        this.world = options.world;
        this.gravity = options.gravity;
        this.updateInterval = options.updateInterval;
        this.velocityTransformerFn = options.velocityTransformerFn;
        this.gravityTransformerFn = options.gravityTransformerFn;
    }

    moveObjects(): void {
        this.world.getObjects().forEach(object => {
            if (!isMovingObject(object)) {
                return;
            }

            const position = object.getPosition();
            const velocity = object.getVelocity();

            const appliedVelocity = typeof this.velocityTransformerFn !== "undefined"
                ? this.velocityTransformerFn(velocity, object)
                : velocity;

            position.x += (appliedVelocity.x / this.updateInterval);
            position.y += (appliedVelocity.y / this.updateInterval);

            if (typeof this.gravity !== "undefined") {
                const appliedGravity = typeof this.gravityTransformerFn !== "undefined"
                    ? this.gravityTransformerFn(this.gravity, object)
                    : this.gravity;

                velocity.x += (appliedGravity.x / this.updateInterval * object.getGravityFactor());
                velocity.y += (appliedGravity.y / this.updateInterval * object.getGravityFactor());
            }

            object.setPosition(position);
            object.setVelocity(velocity);
        });
    }
}