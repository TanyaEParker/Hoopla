import { Sprite, Circle } from "pixi.js";
import { Scene } from "../core/scene";
import { ctx } from "../core/context";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { BubbleGameScene } from "./bubble-game-scene";

export class ColorPickerScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("CHANGE THE\nAQUARIUM COLOUR", DESIGN_HEIGHT * 0.85));

    const colors = [0x8f7bd6, 0xff9a4d, 0x4dd68f];
    colors.forEach((color, i) => {
      const swatch = new Sprite(ctx.assets.circle(30, color));
      swatch.anchor.set(0.5);
      swatch.x = DESIGN_WIDTH / 2 + (i - 1) * 90;
      swatch.y = DESIGN_HEIGHT * 0.25;
      swatch.eventMode = "static";
      swatch.cursor = "pointer";
      swatch.hitArea = new Circle(0, 0, 30);
      swatch.on("pointertap", () => this.manager.goTo(BubbleGameScene));
      this.addChild(swatch);
    });
  }
}
