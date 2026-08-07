import { Sprite, Circle } from "pixi.js";
import { Scene } from "../core/scene";
import { Tween } from "../core/tween";
import { ctx } from "../core/context";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { ColorPickerScene } from "./color-picker-scene";

export class CharacterSelectScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("PLAY TO UNLOCK MORE", DESIGN_HEIGHT * 0.85));

    const turtle = new Sprite(ctx.assets.circle(50, 0x3fae7a));
    turtle.anchor.set(0.5);
    turtle.x = DESIGN_WIDTH / 2;
    turtle.y = DESIGN_HEIGHT * 0.42;
    turtle.eventMode = "static";
    turtle.cursor = "pointer";
    turtle.hitArea = new Circle(0, 0, 50);
    this.addChild(turtle);

    turtle.on("pointertap", () => {
      this.manager.goTo(ColorPickerScene);
    });

    turtle.scale.set(0);
    Tween.to(turtle.scale, { x: 1, y: 1 }, 0.5, Tween.easeOutBack);
  }
}
