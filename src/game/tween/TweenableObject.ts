export interface TweenableObject {
  setTween(tween: number): void;
}

export function isTweenableObject(object: any): object is TweenableObject {
  return typeof object.setTween === 'function';
}
