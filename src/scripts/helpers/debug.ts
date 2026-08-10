import { Graphics, Text } from "pixi.js";

// Toggle this off before shipping — every debug overlay in the project
// should gate on this rather than being removed/re-added by hand.
export const DEBUG = false;

/** Outlined rectangle for visualizing bounds/hitboxes/spawn areas. */
export function debugRect(
  x: number,
  y: number,
  width: number,
  height: number,
  color = 0xff00ff
): Graphics {
  return new Graphics()
    .rect(x, y, width, height)
    .stroke({ color, width: 2, alpha: 0.8 });
}

/** Small filled dot — useful for marking a specific point (spawn center, anchor, etc). */
export function debugDot(x: number, y: number, color = 0xff00ff, radius = 4): Graphics {
  const dot = new Graphics().circle(0, 0, radius).fill({ color, alpha: 0.9 });
  dot.x = x;
  dot.y = y;
  return dot;
}

export function debugLabel(text: string, x: number, y: number, color = 0xff00ff): Text {
  const label = new Text({
    text,
    style: { fontFamily: "Arial", fontSize: 12, fill: color },
  });
  label.x = x;
  label.y = y;
  return label;
}
