import type { Sprite } from "pixi.js";
import { Tween } from "./tween";

/**
 * Tweens a sprite's tint by interpolating R/G/B channels independently,
 * then recombining into a packed tint value each frame. You can't tween
 * `sprite.tint` directly — it's a packed 0xRRGGBB integer, so lerping
 * the raw number produces garbage colors partway through the transition.
 */
export function tweenTint(
  sprite: Sprite,
  toColor: [number, number, number],
  duration: number,
  easing = Tween.easeOutQuad,
  onComplete?: () => void
) {
  const current = sprite.tint as number;
  const from = {
    r: (current >> 16) & 0xff,
    g: (current >> 8) & 0xff,
    b: current & 0xff,
  };
  const [r, g, b] = toColor;

  return Tween.to(
    from,
    { r, g, b },
    duration,
    easing,
    onComplete,
    (t) => {
      sprite.tint = (Math.round(t.r) << 16) | (Math.round(t.g) << 8) | Math.round(t.b);
    }
  );
}
