import {DrawableObject} from './drawing/DrawableObject';
import {Bounds} from './Bounds';

export interface WorldOptions {
  bounds: Bounds;
  ticksPerSecond: number;
}

export class World {
  private readonly bounds: Bounds;
  private readonly ticksPerSecond: number;
  private readonly objects: Set<DrawableObject>;

  constructor(options: WorldOptions) {
    this.bounds = options.bounds;
    this.ticksPerSecond = options.ticksPerSecond;
    this.objects = new Set<DrawableObject>();
  }

  getUpdateInterval(): number {
    return this.ticksPerSecond;
  }

  getBounds(): Bounds {
    return this.bounds;
  }

  getObjects(): Set<DrawableObject> {
    return this.objects;
  }

  deleteObject(object: DrawableObject) {
    this.objects.delete(object);
  }

  addObject(object: DrawableObject) {
    this.objects.add(object);
  }

  clearObjects() {
    this.objects.clear();
  }
}
