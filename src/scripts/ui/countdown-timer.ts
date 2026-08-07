import { Container, Text } from "pixi.js";

export class CountdownTimer extends Container {
  remaining: number;
  Timerlabel: Text;
  private onCompleteCb: (() => void) | null = null;
  private done = false;

  constructor(seconds: number) {
    super();
    this.remaining = seconds;
    this.Timerlabel = new Text({
      text: `${Math.ceil(this.remaining)}`,
      style: {
        fontFamily: "Arial",
        fontSize: 42,
        fontWeight: "bold",
        fill: 0xffffff,
        stroke: { color: 0x000000, width: 4 },
      },
    });
    this.Timerlabel.anchor.set(0.5);
    this.addChild(this.Timerlabel);
  }

  start(onComplete: () => void) {
    this.onCompleteCb = onComplete;
    this.done = false;
  }

  update(deltaMS: number) {
    if (this.done) return;
    this.remaining -= deltaMS / 1000;
    this.Timerlabel.text = `${Math.max(Math.ceil(this.remaining), 0)}`;
    if (this.remaining <= 0) {
      this.done = true;
      this.onCompleteCb?.();
    }
  }
}
