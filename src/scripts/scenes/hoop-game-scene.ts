import { Scene } from "../core/scene";
import { EvolutionScene } from "./evolution-scene";
import { buildLabel } from "../helpers/buildLabel";
import { RemoveActiveCharacter } from "../helpers/backdrop";

export class HoopGameScene extends Scene {
  onEnter() {
    this.addChild(buildLabel("GO THROUGH HOOPS"));
    // TODO: hoop spawn/scroll + drag-to-move turtle + collision check.
    setTimeout(() => {
      RemoveActiveCharacter();
      this.manager.goTo(EvolutionScene)
    }, 1500);
  }

}
