import {World} from "../World";
import {BoundedObject, isBoundedObject} from "./BoundedObject";

export interface BoundryCheckerOptions {
    world: World
}

export class OutOfBoundDetector
{
    private readonly world: World;

    constructor(options: BoundryCheckerOptions) {
        this.world = options.world;
    }

    detectOutOfBound(onOutOfBounds: (object: BoundedObject) => void): void {
        const outOfBoundObjects = new Set<BoundedObject>();

        this.world.getObjects().forEach(object => {
            if (!isBoundedObject(object)) {
                return;
            }

            const bounds = object.getBounds();
            const worldBounds = this.world.getBounds();

            if (
                bounds.bottomRight.x < worldBounds.topLeft.x ||
                bounds.bottomRight.y < worldBounds.topLeft.y ||
                bounds.topLeft.x > worldBounds.bottomRight.x ||
                bounds.topLeft.y > worldBounds.bottomRight.y
            ) {
                outOfBoundObjects.add(object);
            }

        });

        outOfBoundObjects.forEach(object => onOutOfBounds(object));
    }
}