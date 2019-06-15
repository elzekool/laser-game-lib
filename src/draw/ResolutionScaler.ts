import {Shape} from './Shape';
import {Point} from './Point';

export class ResolutionScaler implements Shape {
  private readonly innerShape: Shape;
  private readonly resolutionFactor: number;

  constructor(innerShape: Shape, resolutionFactor: number) {
    this.innerShape = innerShape;
    this.resolutionFactor = resolutionFactor;
  }

  draw(resolution: number): Point[] {
    return this.innerShape.draw(resolution * this.resolutionFactor);
  }
}
