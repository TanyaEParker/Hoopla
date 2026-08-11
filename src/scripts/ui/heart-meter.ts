import { Container, Graphics } from "pixi.js";

export class HeartMeter extends Container {
  maxValue = 2; // e.g. 3 completed games = full heart -> evolution
  value = 0;
  private outline = new Graphics();
  private fill = new Graphics();
  private fillMask = new Graphics();

  constructor() {
    super();
    this.addChild(this.fill, this.outline, this.fillMask);
    this.fill.mask = this.fillMask;
    this.drawHeartPath(this.outline, 'rgb(255,0,0)', false);
    this.redrawFill();
  }

  private drawHeartPath(g: Graphics, color: string, filled: boolean) {
    g.clear();
    g.moveTo(0, 12);
    g.bezierCurveTo(-30, -20, -60, 10, 0, 50);
    g.bezierCurveTo(60, 10, 30, -20, 0, 12);
    if (filled) {
      g.fill({ color });
    } else {
      g.stroke({ width: 4, color });
    }
  }

  private redrawFill() {
    const pct = this.value / this.maxValue;
    this.fillMask
      .clear()
      .rect(-60, 50 - 70 * pct, 120, 70 * pct)
      .fill({ color: 0xffffff });
    this.drawHeartPath(this.fill, 'rgb(255,0,0)', true);
  }

  reset(): void {
    this.value = 0;
    this.redrawFill();
  }

  increment(amount = 1): boolean {
    this.value = Math.min(this.value + amount, this.maxValue);
    this.redrawFill();
    return this.value >= this.maxValue;
  }
}