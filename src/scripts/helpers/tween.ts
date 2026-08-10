// No external tween lib — keeps bundle size down, which matters for
// ad-network file-size caps. Good enough for juice: scale/alpha/position.
type Easing = (t: number) => number;

interface ActiveTween {
  target: any;
  start: Record<string, number>;
  props: Record<string, number>;
  duration: number;
  elapsed: number;
  easing: Easing;
  onComplete?: () => void;
  onUpdate?: (target: any) => void;
  loop: boolean;
  pingpong: boolean;
  reversed: boolean; // internal — tracks which leg of a ping-pong is active
}

class TweenController {
  private active: ActiveTween[] = [];

  to(
    target: any,
    props: Record<string, number>,
    duration: number,
    easing: Easing = this.easeOutQuad,
    onComplete?: () => void,
    onUpdate?: (target: any) => void,
    loop = false,
    pingpong = false
  ) {
    const start: Record<string, number> = {};
    for (const key in props) start[key] = target[key];
    const tweenObj: ActiveTween = {
      target, start, props, duration, elapsed: 0, easing, onComplete, onUpdate,
      loop, pingpong, reversed: false,
    };
    this.active.push(tweenObj);
    return tweenObj;
  }

  // Cancels a tween returned from to() — needed for anything with loop:
  // true, since a looping/ping-ponging tween never finishes on its own.
  stop(tweenObj: ActiveTween) {
    const i = this.active.indexOf(tweenObj);
    if (i !== -1) this.active.splice(i, 1);
  }

  update(deltaMS: number) {
    const dt = deltaMS / 1000;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const t = this.active[i];
      if(!t) return;
      t.elapsed += dt;
      const progress = Math.min(t.elapsed / t.duration, 1);
      const eased = t.easing(progress);
      for (const key in t.props) {
        t.target[key] = t.start[key] + (t.props[key] - t.start[key]) * eased;
      }
      t.onUpdate?.(t.target);
      if (progress >= 1) {
        t.onComplete?.();
        if (t.pingpong) {
          // Swap start/props to play the leg in reverse, rather than
          // hard-resetting — that's what gives the back-and-forth swing
          // instead of a snap back to the start position.
          const oldStart = t.start;
          t.start = t.props;
          t.props = oldStart;
          t.elapsed -= t.duration;
          t.reversed = !t.reversed;
          // reversed === false means we've just completed both legs
          // (there and back) — stop here unless looping indefinitely.
          if (!t.loop && !t.reversed) {
            this.active.splice(i, 1);
          }
        } else if (t.loop) {
          // Subtract rather than zero out, so any overshoot from a slow
          // frame carries into the next cycle instead of being dropped —
          // keeps looped tweens frame-rate independent.
          t.elapsed -= t.duration;
        } else {
          this.active.splice(i, 1);
        }
      }
    }
  }

  easeInQuad: Easing = (t) => t * t;
  easeOutQuad: Easing = (t) => 1 - (1 - t) * (1 - t);
  easeInOutQuad: Easing = (t) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  easeOutBack: Easing = (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
  easeOutElastic: Easing = (t) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  };
}

// Singleton — imported wherever a tween is needed.
export const Tween = new TweenController();