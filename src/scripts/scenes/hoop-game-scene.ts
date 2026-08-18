import { Scene } from "../core/scene";
import { EvolutionScene } from "./evolution-scene";
import { buildLabel } from "../helpers/buildLabel";
import { HeartMeter } from "../ui/heart-meter";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { RemoveActiveCharacter } from "../helpers/backdrop";

export class HoopGameScene extends Scene {
  private heart!: HeartMeter;

  onEnter() {
    if (!this.manager.hud.heart) {
      this.manager.hud.heart = new HeartMeter();

      this.manager.app.stage.addChild(this.manager.hud.heart);
    }
    
    this.heart = this.manager.hud.heart;

    this.addChild(buildLabel("GO THROUGH HOOPS"));
    setTimeout(() => {
      RemoveActiveCharacter();
      if (this.manager.hud.heart) {
        const remaining = this.manager.hud.heart.maxValue;
        this.heart.increment(remaining / 2);
      }
      this.manager.goTo(EvolutionScene)
    }, 1500);
  }
}