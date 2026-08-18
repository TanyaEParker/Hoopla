import { Scene } from "../core/scene";
import { HoopGameScene } from "./hoop-game-scene";
import { buildLabel } from "../helpers/buildLabel";
import { HeartMeter } from "../ui/heart-meter";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";

export class FeedGameScene extends Scene {
  private heart!: HeartMeter;

  onEnter() {
    if (!this.manager.hud.heart) {
      this.manager.hud.heart = new HeartMeter();

      this.manager.app.stage.addChild(this.manager.hud.heart);
    }
    
    this.heart = this.manager.hud.heart;

    this.addChild(buildLabel("TIME TO FEED!"));
    setTimeout(() => {
      const remaining = this.heart.maxValue - this.heart.value;
      this.heart.increment(remaining / 2);
      this.manager.goTo(HoopGameScene);
    }, 1500);
  }
}