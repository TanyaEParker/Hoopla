import { Sprite, Text, Circle } from "pixi.js";
import { Scene } from "../core/scene";
import { Tween } from "../core/tween";
import { ctx } from "../core/context";
import { buildBackdrop, buildLabel } from "../helpers/backdrop";
import { HeartMeter } from "../ui/heart-meter";
import { CountdownTimer } from "../ui/countdown-timer";
import { DESIGN_WIDTH, DESIGN_HEIGHT, GAME_DURATION, PALETTE } from "../constants";
import { FeedGameScene } from "./feed-game-scene";

interface Bubble extends Sprite {
  _popped: boolean;
  _bobPhase: number;
}

export class BubbleGameScene extends Scene {
  private bubbles: Bubble[] = [];
  private spawnTimer = 0;
  private spawnInterval = 0.8;
  private heart!: HeartMeter;
  private instructionLabel!: Text;
  private timer?: CountdownTimer;
  private roundActive = false;

  onEnter() {
    this.addChild(buildBackdrop());

    this.heart = this.manager.hud.heart ?? new HeartMeter();
    this.manager.hud.heart = this.heart;
    this.heart.x = DESIGN_WIDTH / 2;
    this.heart.y = 90;
    this.addChild(this.heart);
    this.heart.reset();

    this.instructionLabel = buildLabel("TIME TO PLAY!", DESIGN_HEIGHT * 0.85);
    this.addChild(this.instructionLabel);

    setTimeout(() => this.beginTimedRound(), 1200);
  }
  onExit(): void {
    if (this.heart) this.removeChild(this.heart);
  }

  private beginTimedRound() {
    this.instructionLabel.text = "TAP THE BUBBLES";
    this.timer = new CountdownTimer(GAME_DURATION);
    this.timer.x = DESIGN_WIDTH / 2;
    this.timer.y = DESIGN_HEIGHT * 0.22;
    this.addChild(this.timer);
    this.timer.start(() => this.onRoundComplete());
    this.roundActive = true;
  }

  private spawnBubble() {
    const bubble = new Sprite(ctx.assets.circle(28, PALETTE.bubbleBlue, 0.85)) as Bubble;
    bubble.anchor.set(0.5);
    bubble.x = DESIGN_WIDTH / 2 + (Math.random() - 0.5) * 300;
    bubble.y = DESIGN_HEIGHT * 0.55;
    bubble.eventMode = "static";
    bubble.cursor = "pointer";
    bubble.hitArea = new Circle(0, 0, 28);
    bubble.scale.set(0);
    bubble._popped = false;
    bubble._bobPhase = Math.random() * Math.PI * 2;

    Tween.to(bubble.scale, { x: 1, y: 1 }, 0.3, Tween.easeOutBack);
    bubble.on("pointertap", () => this.popBubble(bubble));

    this.bubbles.push(bubble);
    this.addChild(bubble);
  }

  private popBubble(bubble: Bubble) {
    if (bubble._popped) return;
    bubble._popped = true;
    bubble.eventMode = "none";

    Tween.to(bubble.scale, { x: 1.4, y: 1.4 }, 0.15, Tween.easeOutQuad);
    Tween.to(bubble, { alpha: 0 }, 0.2, Tween.easeOutQuad, () => {
      this.removeChild(bubble);
      this.bubbles = this.bubbles.filter((b) => b !== bubble);
    });

    this.spawnPopParticles(bubble.x, bubble.y);
    this.heart.increment(0.05);
  }

  private spawnPopParticles(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      const p = new Sprite(ctx.assets.circle(4, 0xffffff));
      p.anchor.set(0.5);
      p.x = x;
      p.y = y;
      this.addChild(p);
      const angle = (Math.PI * 2 * i) / 6;
      Tween.to(
        p,
        { x: x + Math.cos(angle) * 40, y: y + Math.sin(angle) * 40, alpha: 0 },
        0.4,
        Tween.easeOutQuad,
        () => this.removeChild(p)
      );
    }
  }

  private onRoundComplete() {
    this.roundActive = false;
    this.bubbles.forEach((b) => this.removeChild(b));
    this.bubbles = [];
    if (this.timer) this.removeChild(this.timer);
    this.instructionLabel.text = "GREAT JOB!";
    setTimeout(() => this.manager.goTo(FeedGameScene), 1000);
  }

  update(deltaMS: number) {
    if (!this.roundActive || !this.timer) return;
    this.timer.update(deltaMS);

    this.spawnTimer += deltaMS / 1000;
    if (this.spawnTimer >= this.spawnInterval && this.bubbles.length < 4) {
      this.spawnTimer = 0;
      this.spawnBubble();
    }

    const t = performance.now() / 1000;
    this.bubbles.forEach((b) => {
      if (!b._popped) b.y += Math.sin(t * 2 + b._bobPhase) * 0.3;
    });
  }
}
