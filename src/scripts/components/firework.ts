import { Container, Sprite } from "pixi.js";
import { ctx } from "../core/context";
import { Tween } from "../helpers/tween";
import type { AssetAlias } from "../core/manifest";
export class Firework extends Container {
  private firework: Sprite;

  constructor(fireworkAlias: AssetAlias, noiseAlias: AssetAlias) {
    super();

    this.firework = new Sprite(ctx.assets.get(fireworkAlias));
    this.firework.anchor.set(0.5);
    this.addChild(this.firework);

    this.firework.scale.set(0);
    this.firework.alpha = 0;
    this.firework.rotation = -4;
  }

  public PlayEffect(callback: () => void)
  {
    
    Tween.to(this.firework.scale,{x:2,y:2},0.8,Tween.easeInOutQuad,callback);
    Tween.to(this.firework,{y:-20,alpha:1,rotation:4},.5,Tween.easeInQuad,()=>
      {
        ctx.assets.getSound("FireworkTone");

        Tween.to(this.firework,{y:-40,alpha:0,rotation:6},0.25,Tween.easeOutQuad)
      });
  }

  destroy(options?: Parameters<Container["destroy"]>[0]) {
    super.destroy(options);
  }
}