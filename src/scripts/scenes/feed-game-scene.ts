import { Scene } from "../core/scene";
import { HoopGameScene } from "./hoop-game-scene";
import { buildLabel } from "../helpers/buildLabel";

export class FeedGameScene extends Scene {
  onEnter() {
    this.addChild(buildLabel("TIME TO FEED!"));
    // TODO: shrinking food pellet + swipe-left/right catch logic.
    // Reuse CountdownTimer + this.manager.hud.heart as in BubbleGameScene.
    setTimeout(() => this.manager.goTo(HoopGameScene), 1500);
  }
}
