import {DrawInfo} from "./DrawInfo";

export interface DrawableObject {
    draw(): DrawInfo
}

export function isDrawableObject(object: any): object is DrawableObject {
    return (typeof object.draw === "function");
}