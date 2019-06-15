import {DrawableObject} from "./drawing/DrawableObject";
import {Bounds} from "./Bounds";

export interface WorldOptions {
    bounds : Bounds,
}

export class World {
    private readonly bounds : Bounds;
    private readonly objects : Set<DrawableObject>;

    constructor(options: WorldOptions) {
        this.bounds = options.bounds;
        this.objects = new Set<DrawableObject>();
    }

    getBounds() : Bounds {
        return this.bounds;
    }

    getObjects() : Set<DrawableObject> {
        return this.objects;
    }

    deleteObject(object : DrawableObject) {
        this.objects.delete(object);
    }

    addObject(object : DrawableObject) {
        this.objects.add(object);
    }

    clearObjects() {
        this.objects.clear();
    }
}