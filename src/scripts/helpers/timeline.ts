import { Tween } from "./tween";
import type { Easing } from "./tween";

interface TimelineStep {
  target: any;
  props: Record<string, number>;
  duration: number;
  easing?: Easing;
}

export class Timeline {
  private steps: TimelineStep[] = [];
  private currentTween?: ReturnType<typeof Tween.to>;
  private currentIndex = 0;
  private onCompleteCallback?: () => void;
  private isPlaying = false;

  add(
    target: any,
    props: Record<string, number>,
    duration: number,
    easing?: Easing
  ): this {
    this.steps.push({ target, props, duration, easing });
    return this;
  }

  onComplete(callback: () => void): this {
    this.onCompleteCallback = callback;
    return this;
  }

  play(): void {
    if (this.isPlaying || this.steps.length === 0) return;
    this.isPlaying = true;
    this.currentIndex = 0;
    this.playNext();
  }

  private playNext(): void {
    if (this.currentIndex >= this.steps.length) {
      this.isPlaying = false;
      this.onCompleteCallback?.();
      return;
    }

    const { target, props, duration, easing } = this.steps[this.currentIndex];
    this.currentIndex++;

    this.currentTween = Tween.to(
      target,
      props,
      duration,
      easing ?? Tween.easeOutQuad,
      () => this.playNext()
    );
  }

  stop(): void {
    if (this.currentTween) Tween.stop(this.currentTween);
    this.isPlaying = false;
    this.currentIndex = 0;
  }

  destroy(): void {
    this.stop();
  }
}