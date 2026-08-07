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
}

class TweenController {
  private active: ActiveTween[] = [];

  to(
    target: any,
    props: Record<string, number>,
    duration: number,
    easing: Easing = this.easeOutQuad,
    onComplete?: () => void
  ) {
    const start: Record<string, number> = {};
    for (const key in props) start[key] = target[key];
    const tweenObj: ActiveTween = { target, start, props, duration, elapsed: 0, easing, onComplete };
    this.active.push(tweenObj);
    return tweenObj;
  }

  update(deltaMS: number) {
    const dt = deltaMS / 1000;
    for (let i = this.active.length - 1; i >= 0; i--) {
      const t = this.active[i];
      t.elapsed += dt;
      const progress = Math.min(t.elapsed / t.duration, 1);
      const eased = t.easing(progress);
      for (const key in t.props) {
        t.target[key] = t.start[key] + (t.props[key] - t.start[key]) * eased;
      }
      if (progress >= 1) {
        this.active.splice(i, 1);
        t.onComplete?.();
      }
    }
  }

  easeOutQuad: Easing = (t) => 1 - (1 - t) * (1 - t);
  easeOutBack: Easing = (t) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  };
}

// Singleton — imported wherever a tween is needed.
export const Tween = new TweenController();
