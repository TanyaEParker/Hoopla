import { Container, Graphics } from "pixi.js"
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants";

export function createLoader():Container{
    const Wrapper = new Container();
    const BG = new Graphics();
    BG.setSize(DESIGN_WIDTH,DESIGN_HEIGHT);
    BG.fill({color:'rgb(61, 111, 250)'});
    Wrapper.addChild(BG);
    return Wrapper;
}