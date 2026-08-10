import { Container, Text } from "pixi.js";
import { buildLabel } from "../helpers/buildLabel";
import { DESIGN_HEIGHT } from "../constants";

export class CountdownTimer extends Container {
  remaining: number;
  Timerlabel: Text;
  private onCompleteCb: (() => void) | null = null;
  private done = false;

  constructor(seconds: number) {
    super();
    this.remaining = seconds;
    this.Timerlabel = buildLabel(`${Math.round(this.remaining)}s`,DESIGN_HEIGHT*0.365);
    this.Timerlabel.scale.set(1.5)
    this.addChild(this.Timerlabel);
  }

  start(onComplete: () => void) {
    this.onCompleteCb = onComplete;
    this.done = false;
  }

  update(deltaMS: number) {
    if (this.done) return;
    this.remaining -= deltaMS / 1000;
    this.Timerlabel.text = `${Math.max(Math.round(this.remaining), 0)}s`;
    if (this.remaining < 0) {
      this.done = true;
      this.onCompleteCb?.();
    }
  }
}
