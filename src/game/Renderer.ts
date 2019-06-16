import {Line} from '@laser-dac/draw';
import {World} from './World';
import {Vector} from './Vector';
import {Scene} from '../draw';
import {ResolutionScaler} from '../draw';
import {DrawableObject} from './drawing';
import {DrawInfo} from './drawing';
import {VectorMath} from '../util';

export interface RendererOptions {
  scene: Scene;
  world: World;
  pathOptimizer?: (drawObjects: DrawInfo[]) => DrawInfo[];
}

export interface RendererRenderOptions {
  extraObjects?: DrawableObject[];
}

export class Renderer {
  private readonly scene: Scene;
  private readonly world: World;
  private readonly pathOptimizer: (drawObjects: DrawInfo[]) => DrawInfo[];
  private lastPoint: Vector;

  constructor(options: RendererOptions) {
    this.scene = options.scene;
    this.world = options.world;
    this.pathOptimizer = options.pathOptimizer || Renderer.noOpOptimizer;
    this.lastPoint = {x: 0, y: 0};
  }

  render(options?: RendererRenderOptions): void {
    const objectsToRender: DrawInfo[] = [];
    this.world
      .getObjects()
      .forEach((object) => objectsToRender.push(object.draw()));

    if (
      typeof options !== 'undefined' &&
      typeof options.extraObjects !== 'undefined'
    ) {
      options.extraObjects.forEach((object) =>
        objectsToRender.push(object.draw())
      );
    }

    this.pathOptimizer(objectsToRender).forEach((object) =>
      this.renderObject(object)
    );
  }

  private renderObject(drawData: DrawInfo): void {
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

  static noOpOptimizer(drawObjects: DrawInfo[]): DrawInfo[] {
    return drawObjects;
  }

  static topToBottomOptimizer(drawObjects: DrawInfo[]): DrawInfo[] {
    drawObjects.sort((a, b) => {
      if (
        typeof a.firstPos === 'undefined' ||
        typeof b.firstPos === 'undefined'
      ) {
        return 0;
      }

      if (a.firstPos.y < b.firstPos.y) {
        return -1;
      } else if (a.firstPos.y > b.firstPos.y) {
        return 1;
      }

      return 0;
    });

    return drawObjects;
  }

  static leftToRightOptimizer(drawObjects: DrawInfo[]): DrawInfo[] {
    drawObjects.sort((a, b) => {
      if (
        typeof a.firstPos === 'undefined' ||
        typeof b.firstPos === 'undefined'
      ) {
        return 0;
      }

      if (a.firstPos.x < b.firstPos.x) {
        return -1;
      } else if (a.firstPos.x > b.firstPos.x) {
        return 1;
      }

      return 0;
    });

    return drawObjects;
  }

  static nearestElementOptimizer(drawObjects: DrawInfo[]): DrawInfo[] {
    const remainingObjects = new Set<DrawInfo>(drawObjects);
    const sortedObjects: DrawInfo[] = [];

    let findNearestTo = {x: 0, y: 0};

    const findNextNearest = () => {
      let minDistance: number | null = null;
      let objectWithMinDistance: DrawInfo | null = null;

      remainingObjects.forEach((object) => {
        if (typeof object.firstPos === 'undefined') {
          return;
        }

        const distance = VectorMath.distance(findNearestTo, object.firstPos);
        if (minDistance === null || distance < minDistance) {
          minDistance = distance;
          objectWithMinDistance = object;
        }
      });

      if (objectWithMinDistance === null) {
        objectWithMinDistance = remainingObjects.values().next().value;
      }

      sortedObjects.push(objectWithMinDistance);
      remainingObjects.delete(objectWithMinDistance);

      if (typeof objectWithMinDistance.lastPos !== 'undefined') {
        findNearestTo = objectWithMinDistance.lastPos;
      }
    };

    while (remainingObjects.size > 0) {
      findNextNearest();
    }

    return sortedObjects;
  }
}
