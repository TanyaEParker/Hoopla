import { Scene } from "../core/scene";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_HEIGHT } from "../constants";
import { HoopGameScene } from "./hoop-game-scene";

export class FeedGameScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("TIME TO FEED!", DESIGN_HEIGHT * 0.85));
    // TODO: shrinking food pellet + swipe-left/right catch logic.
    // Reuse CountdownTimer + this.manager.hud.heart as in BubbleGameScene.
    setTimeout(() => this.manager.goTo(HoopGameScene), 1500);
  }
}
