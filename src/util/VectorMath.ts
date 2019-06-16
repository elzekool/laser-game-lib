import {Vector} from '../game';
import {PolarVector} from '../game/PolarVector';

export class VectorMath {
  static add(a: Vector, b: Vector): Vector {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
    };
  }

  static sub(a: Vector, b: Vector): Vector {
    return {
      x: a.x - b.x,
      y: a.y - b.y,
    };
  }

  static invert(vector: Vector): Vector {
    return {
      x: -vector.x,
      y: -vector.y,
    };
  }

  static invertX(vector: Vector): Vector {
    return {
      x: -vector.x,
      y: vector.y,
    };
  }

  static invertY(vector: Vector): Vector {
    return {
      x: vector.x,
      y: -vector.y,
    };
  }

  static rotate(vector: Vector, rad: number): Vector {
    return {
      x: vector.x * Math.cos(rad) - vector.y * Math.sin(rad),
      y: vector.x * Math.sin(rad) + vector.y * Math.cos(rad),
    };
  }

  static fromPolar(vector: PolarVector): Vector {
    return {
      x: vector.size * Math.cos(vector.angle),
      y: vector.size * Math.sin(vector.angle),
    };
  }

  static toPolar(vector: Vector): PolarVector {
    return {
      size: Math.hypot(vector.x, vector.y),
      angle: Math.atan2(vector.y, vector.x),
    };
  }

  static rotateDeg(vector: Vector, deg: number): Vector {
    return VectorMath.rotate(vector, VectorMath.deg2rad(deg));
  }

  static distance(a: Vector, b: Vector): number {
    const x = a.x - b.x;
    const y = a.y - b.y;
    return Math.hypot(x, y);
  }

  static rad2deg(rad: number): number {
    return (rad * 180.0) / Math.PI;
  }

  static deg2rad(deg: number): number {
    return deg / (180.0 / Math.PI);
  }
}
