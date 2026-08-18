import { Container, Graphics, Sprite } from "pixi.js";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants";
import { Scene } from "../core/scene";
import { buildLabel } from "../helpers/buildLabel";
import { CharacterSelectScene } from "./character-select-scene";
import { ctx } from "../core/context";
import { Tween } from "../helpers/tween";

const barWidth = DESIGN_WIDTH*0.8;
//fake loader but it builds anticipation
export class LoadingScreenScene extends Scene {
  onEnter() {
    const BG = new Sprite(ctx.assets.get("background"));
    this.addChild(BG);
    BG.scale.set(3.5);

    this.addChild(buildLabel("loading!",DESIGN_HEIGHT*0.375));
    const loadingBar = new Container();
    loadingBar.position.set((DESIGN_WIDTH*0.5)-barWidth/2,DESIGN_HEIGHT*0.5)

    const baseBar = new Graphics()
      .roundRect(0, 0, barWidth-2, 38, 25)
      .fill({ color: 'rgb(16, 135, 225)' });
    loadingBar.addChild(baseBar);

    const fillBar = new Graphics().roundRect(0, 0, barWidth, 40, 25).fill({ color: 'rgb(109, 174, 224)' });
    fillBar.width = 0;

    loadingBar.addChild(fillBar)
    this.addChild(loadingBar);
    Tween.to(fillBar,{width:barWidth},2,Tween.easeInOutQuad,()=>{
        ctx.assets.getSound('BGM',true);
        this.manager.goTo(CharacterSelectScene)
      });
  };
}
