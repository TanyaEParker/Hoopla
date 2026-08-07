import { Scene } from "../core/scene";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_HEIGHT } from "../constants";
import { EndCardScene } from "./end-card-scene";

export class EvolutionScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("WOW!", DESIGN_HEIGHT * 0.85));
    // TODO: sparkle particle burst + scale/glow tween on the pet sprite.
    setTimeout(() => this.manager.goTo(EndCardScene), 2000);
  }
}
