import { Scene } from "../core/scene";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { DESIGN_HEIGHT } from "../constants";
import { EvolutionScene } from "./evolution-scene";

export class HoopGameScene extends Scene {
  onEnter() {
    this.addChild(buildBackdrop());
    this.addChild(buildLabel("GO THROUGH HOOPS", DESIGN_HEIGHT * 0.85));
    // TODO: hoop spawn/scroll + drag-to-move turtle + collision check.
    setTimeout(() => this.manager.goTo(EvolutionScene), 1500);
  }
}
