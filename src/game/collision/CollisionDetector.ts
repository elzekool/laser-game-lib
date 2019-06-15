import {CollidableObject, isCollidableObject} from "./CollidableObject";
import {IntersectionLine} from "./IntersectionLine";
import {Vector} from "../Vector";
import {World} from "../World";
import {CollisionInfo} from "./CollisionInfo";

const CCW = (p1: Vector, p2: Vector, p3: Vector): boolean => {
    return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
};

const linesIntersect = (line1: IntersectionLine, line2: IntersectionLine): boolean => {
    // See https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    return (
        CCW(line1.from, line2.from, line2.to) != CCW(line1.to, line2.from, line2.to)) &&
        (CCW(line1.from, line1.to, line2.from) != CCW(line1.from, line1.to, line2.to)
    );
};

export interface CollisionDetectorOptions {
    world : World
}

export class CollisionDetector
{
    private readonly world: World;

    constructor(options : CollisionDetectorOptions) {
        this.world = options.world;
    }

    public detectCollisions(onCollision: (collision: CollisionInfo) => void): void {
        const collisions = new Set<CollisionInfo>();

        this.world.getObjects().forEach(object1 => {
            if (!isCollidableObject(object1)) {
                return;
            }

            this.world.getObjects().forEach(object2 => {
                if (object1 === object2 || !isCollidableObject(object2)) {
                    return;
                }

                if (this.objectsCollide(object1, object2)) {
                    collisions.add({
                        objects : [ object1, object2 ]
                    });
                }
            });
        });

        collisions.forEach(collision => onCollision(collision));
    }

    private objectsCollide(object1: CollidableObject, object2: CollidableObject): boolean {
        const obj1IntersectionLines = object1.intersectionTestLines();
        const obj2IntersectionLines = object2.intersectionTestLines();

        for(let i = 0; i < obj1IntersectionLines.length; i++) {
            for(let j = 0; j < obj2IntersectionLines.length; j++) {
                if (linesIntersect(
                    obj1IntersectionLines[i],
                    obj2IntersectionLines[j]
                )) {
                    return true;
                }
            }
        }

        return false;
    }

}