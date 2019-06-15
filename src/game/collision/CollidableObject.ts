import {IntersectionLine} from './IntersectionLine';

export interface CollidableObject {
  intersectionTestLines(): IntersectionLine[];
}

export function isCollidableObject(object: any): object is CollidableObject {
  return typeof object.intersectionTestLines === 'function';
}
