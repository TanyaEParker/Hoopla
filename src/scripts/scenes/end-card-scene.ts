import { Sprite } from "pixi.js";
import { Scene } from "../core/scene";
import { ctx } from "../core/context";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_WIDTH, DESIGN_HEIGHT, PALETTE } from "../constants";
import { CharacterSelectScene } from "./character-select-scene";

export class EndCardScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("MORE UNLOCKED!", DESIGN_HEIGHT * 0.6));

    const replay = new Sprite(ctx.assets.roundedRect(160, 60, 16, 0x8f7bd6));
    replay.anchor.set(0.5);
    replay.x = DESIGN_WIDTH / 2 - 100;
    replay.y = DESIGN_HEIGHT * 0.75;
    replay.eventMode = "static";
    replay.cursor = "pointer";
    replay.on("pointertap", () => this.manager.goTo(CharacterSelectScene));
    this.addChild(replay);

    const learnMore = new Sprite(ctx.assets.roundedRect(160, 60, 16, PALETTE.gold));
    learnMore.anchor.set(0.5);
    learnMore.x = DESIGN_WIDTH / 2 + 100;
    learnMore.y = DESIGN_HEIGHT * 0.75;
    learnMore.eventMode = "static";
    learnMore.cursor = "pointer";
    // Clickthrough — real ad networks expose their own API for this
    // (e.g. MRAID's mraid.open(), or a network-specific click macro).
    learnMore.on("pointertap", () => console.log("clickthrough fired"));
    this.addChild(learnMore);
  }
}
