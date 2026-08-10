import { Sprite, Text,} from "pixi.js";
import { Scene } from "../core/scene";
import { Tween } from "../helpers/tween";
import { ctx } from "../core/context";
import { HeartMeter } from "../ui/heart-meter";
import { CountdownTimer } from "../ui/countdown-timer";
import { DESIGN_WIDTH, DESIGN_HEIGHT, GAME_DURATION } from "../constants";
import { FeedGameScene } from "./feed-game-scene";
import { buildLabel } from "../helpers/buildLabel";
import { DEBUG, debugDot, debugLabel, debugRect } from "../helpers/debug";

interface Bubble extends Sprite {
  _popped: boolean;
  _bobPhase: number;
}
const SPAWN_X_RANGE = 500;
const SPAWN_Y_RANGE = 200;
const SPAWN_CENTER_Y = DESIGN_HEIGHT * 0.6;
const POP_RADIUS = 20;
export class BubbleGameScene extends Scene {
  private bubbles: Bubble[] = [];
  private spawnTimer = 0;
  private spawnInterval = 0.5;
  private heart!: HeartMeter;
  private instructionLabel!: Text;
  private timer?: CountdownTimer;
  private roundActive = false;

  

  onEnter() {

    this.heart = this.manager.hud.heart ?? new HeartMeter();
    this.manager.hud.heart = this.heart;
    this.heart.x = DESIGN_WIDTH / 2;
    this.heart.y = DESIGN_HEIGHT * 0.185;
    this.heart.scale.set(2);
    this.addChild(this.heart);
    this.heart.reset();

    this.instructionLabel = buildLabel("TIME TO PLAY!");
    this.addChild(this.instructionLabel);

    if (DEBUG) this.drawSpawnBoundsDebug();

    setTimeout(() => this.beginTimedRound(), 1200);
  }

  private drawSpawnBoundsDebug() {
    const left = DESIGN_WIDTH / 2 - SPAWN_X_RANGE / 2;
    const top = SPAWN_CENTER_Y - SPAWN_Y_RANGE / 2;
    this.addChild(debugRect(left, top, SPAWN_X_RANGE, SPAWN_Y_RANGE));
    this.addChild(debugDot(DESIGN_WIDTH / 2, SPAWN_CENTER_Y));
    this.addChild(debugLabel("bubble spawn area", left, top - 14));
  }

  onExit(): void {
    if (this.heart) this.removeChild(this.heart);
  }

  private beginTimedRound() {
    this.instructionLabel.text = "TAP THE BUBBLES";
    this.timer = new CountdownTimer(GAME_DURATION);
    this.addChild(this.timer);
    this.timer.start(() => this.onRoundComplete());
    this.roundActive = true;
  }

  private spawnBubble() {
    const frame = Math.floor(Math.random() * 3) as 0 | 1 | 2;
    const bubble = new Sprite(ctx.assets.bubbleFrame(frame)) as Bubble;
    bubble.anchor.set(0.5);
    bubble.x = DESIGN_WIDTH / 2 + (Math.random() - 0.5) * SPAWN_X_RANGE;
    bubble.y = SPAWN_CENTER_Y + (Math.random() - 0.5) * SPAWN_Y_RANGE;
    bubble.eventMode = "static";
    bubble.cursor = "pointer";
    // bubble.hitArea = new Circle(0, 0, 28);
    bubble.scale.set(0);
    bubble._popped = false;
    bubble._bobPhase = Math.random() * Math.PI * 2;

    Tween.to(bubble.scale, { x: 1.3, y: 1.3 }, 0.3, Tween.easeOutBack);
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
      const p = new Sprite(ctx.assets.get('bubblePop'));
      p.anchor.set(0.5);
      p.x = x;
      p.y = y;
      this.addChild(p);
      const angle = (Math.PI * 2 * i) / 6;
      p.rotation = angle;
      Tween.to(
        p,
        { x: x + Math.cos(angle) * POP_RADIUS, y: y + Math.sin(angle) * POP_RADIUS, alpha: 0 },
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
    if (this.spawnTimer >= this.spawnInterval && this.bubbles.length < 6) {
      this.spawnTimer = 0;
      this.spawnBubble();
    }

    const t = performance.now() / 1000;
    this.bubbles.forEach((b) => {
      if (!b._popped) b.y += Math.sin(t * 2 + b._bobPhase) * 0.3;
    });
  }
}
