import {Shape} from "../../draw/Shape";
import {Vector} from "../Vector";

export interface DrawInfo {
    shapes: Shape[],
    firstPos?: Vector,
    lastPos?: Vector
}