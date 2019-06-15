import {Bounds} from "../Bounds";

export interface BoundedObject {
    getBounds(): Bounds;
}

export function isBoundedObject(object: any): object is BoundedObject {
    return (typeof object.getBounds === "function");
}