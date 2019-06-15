import {Vector} from '../Vector';

export interface MovingObject {
  getPosition(): Vector;
  setPosition(position: Vector): void;
  getVelocity(): Vector;
  setVelocity(velocity: Vector): void;
  getGravityFactor(): number;
}

export function isMovingObject(object: any): object is MovingObject {
  return (
    typeof object.getPosition === 'function' &&
    typeof object.setPosition === 'function' &&
    typeof object.getVelocity === 'function' &&
    typeof object.setVelocity === 'function' &&
    typeof object.getGravityFactor === 'function'
  );
}
