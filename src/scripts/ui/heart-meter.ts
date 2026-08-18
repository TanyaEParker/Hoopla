import { Container, Sprite, Graphics } from "pixi.js";
import { ctx } from "../core/context";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants";
import { Tween } from "../helpers/tween";

export class HeartMeter extends Container {
  maxValue = 1.4; 
  value = 0;
  private heartOutline: Sprite;
  private heartFill: Sprite;
  private fillMask: Graphics;

  constructor() {
    super();
    
    this.heartFill = new Sprite(ctx.assets.get("heartFill"));
    this.heartFill.anchor.set(0.5);
    this.addChild(this.heartFill);
    
    this.fillMask = new Graphics();
    this.addChild(this.fillMask);
    this.heartFill.mask = this.fillMask;
    
    this.heartOutline = new Sprite(ctx.assets.get("heart"));
    this.heartOutline.anchor.set(0.5);
    this.addChild(this.heartOutline);
    
    this.redrawFill();
    this.x = DESIGN_WIDTH * 0.5;
    this.y = DESIGN_HEIGHT * 0.225
    this.scale.set(0)
    Tween.to(this.scale,{x:4,y:4},0.25,Tween.easeInOutQuad);
  }

  private redrawFill() {
    const pct = this.value / this.maxValue;
    const height = this.heartOutline.height;
    const maskHeight = height * pct;
    
    this.fillMask.clear();
    this.fillMask.rect(
      -this.heartOutline.width / 2,
      height / 2 - maskHeight,
      this.heartOutline.width,
      maskHeight
    );
    this.fillMask.fill({ color: 0xffffff });
  }

  reset(): void {
    this.value = 0;
    this.redrawFill();
  }

  increment(amount = 1): boolean {
    this.value = Math.min(this.value + amount, this.maxValue);
    this.redrawFill();
    return this.value >= this.maxValue;
  }
}