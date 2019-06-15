import {Line} from "@laser-dac/draw";
import {World} from "./World";
import {Vector} from "./Vector";
import {Scene} from "../draw/Scene";
import {ResolutionScaler} from "../draw/ResolutionScaler";

export interface GameRunnerOptions {
    scene: Scene;
    world: World;
}

export class Renderer
{
    private readonly scene: Scene;
    private readonly world: World;
    private lastPoint : Vector;

    constructor(options: GameRunnerOptions) {
        this.scene = options.scene;
        this.world = options.world;
        this.lastPoint = { x : 0,  y : 0 };
    }

    render() : void {
        this.world.getObjects().forEach(object => {
            const drawData = object.draw();

            if (drawData.firstPos !== undefined) {
                this.scene.add(
                    new ResolutionScaler(new Line({
                        from : this.lastPoint,
                        to : drawData.firstPos,
                        color : [0,0,0]
                    }), 0.75)
                );
                this.lastPoint = drawData.firstPos;
            }

            drawData.shapes.forEach(shape => {
                this.scene.add(shape);
            });

            if (drawData.lastPos !== undefined) {
                this.lastPoint = drawData.lastPos;
            }
        });
    };
}