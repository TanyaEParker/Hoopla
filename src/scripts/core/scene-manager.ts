import { Application } from "pixi.js";
import type { Scene, SceneClass } from "./scene";
import type { HeartMeter } from "../ui/heart-meter";

export class SceneManager {
  current: Scene | null = null;
  hud: { heart: HeartMeter | null } = { heart: null };
  // private overlay: Graphics;
  public app: Application;

  constructor(app: Application) {
    this.app = app;

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


    };

    if (!this.current) {
      finishSwap();
      return;
    }
    finishSwap();

  }
}
