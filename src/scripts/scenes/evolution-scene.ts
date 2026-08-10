import { Scene } from "../core/scene";
import { EndCardScene } from "./end-card-scene";
import { buildLabel } from "../helpers/buildLabel";

export class EvolutionScene extends Scene {
  onEnter() {
    this.addChild(buildLabel("WOW!"));
    // TODO: sparkle particle burst + scale/glow tween on the pet sprite.
    setTimeout(() => this.manager.goTo(EndCardScene), 2000);
  }
}
