import { Application, Graphics } from "pixi.js";
import { Tween } from "../helpers/tween";
import type { Scene, SceneClass } from "./scene";
import type { HeartMeter } from "../ui/heart-meter";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";

export class SceneManager {
  current: Scene | null = null;
  hud: { heart: HeartMeter | null } = { heart: null };
  // private overlay: Graphics;
  private app: Application;

  constructor(app: Application) {
    this.app = app;
    // this.overlay = new Graphics()
    //   .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT)
    //   .fill({ color: 'rgb(33, 141, 235)' });
    // this.overlay.alpha = 0;
    // this.overlay.eventMode = "none";

    this.app.ticker.add(() => {
      this.current?.update(app.ticker.deltaMS);
    });
  }

  goTo(SceneCtor: SceneClass) {
    const incoming = new SceneCtor(this);

    const finishSwap = () => {
      if (this.current) {
        this.current.onExit();
        this.app.stage.removeChild(this.current);
        this.current.destroy({ children: true });
      }
      this.app.stage.addChild(incoming);
      this.current = incoming;
      incoming.onEnter();

      // this.overlay.alpha = 0;
      // this.app.stage.addChild(this.overlay);
      // Tween.to(this.overlay, { alpha: 0 }, 0.35, Tween.easeOutQuad, () => {
      //   // this.app.stage.removeChild(this.overlay);
      // });
    };

    if (!this.current) {
      finishSwap();
      return;
    }
    finishSwap();
    // this.overlay.alpha = 0;
    // this.app.stage.addChild(this.overlay);
    // Tween.to(this.overlay, { alpha: 0 }, 0.25, Tween.easeOutQuad, finishSwap);
  }
}
