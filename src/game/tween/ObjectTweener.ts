import {World} from '../World';
import {TweenableObject} from './TweenableObject';

export interface ObjectTweenerOptions {
  world: World;
}

export interface StartTweenOptions {
  object: TweenableObject;
  duration: number;
  repeat?: boolean;
  onTweenEnd?: (object: TweenableObject) => void;
}

interface ActiveTween {
  current: number;
  stepSize: number;
  repeat: boolean;
  onTweenEnd?: (object: TweenableObject) => void;
}

export class ObjectTweener {
  private readonly world: World;
  private readonly activeTweens: Map<TweenableObject, ActiveTween>;

  constructor(options: ObjectTweenerOptions) {
    this.world = options.world;
    this.activeTweens = new Map<TweenableObject, ActiveTween>();
  }

  startTween(options: StartTweenOptions) {
    const object: TweenableObject = options.object;

    if (this.activeTweens.has(object)) {
      this.activeTweens.delete(object);
    }

    this.activeTweens.set(object, {
      current: 0,
      stepSize: 1.0 / this.world.getUpdateInterval() / options.duration,
      repeat: options.repeat || false,
      onTweenEnd: options.onTweenEnd,
    });
  }

  updateTweens() {
    this.activeTweens.forEach((activeTween, object) => {
      activeTween.current += activeTween.stepSize;

      if (activeTween.current > 1.0) {
        if (activeTween.repeat) {
          activeTween.current = 0;
        } else {
          this.activeTweens.delete(object);
          if (typeof activeTween.onTweenEnd !== 'undefined') {
            activeTween.onTweenEnd(object);
          }
          return;
        }
      }

      object.setTween(activeTween.current);
    });
  }
}
