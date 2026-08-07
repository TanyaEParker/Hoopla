import { Application, Graphics, Texture } from "pixi.js";
import type { AssetFactory } from "./context";

// Placeholder generator so the flow is testable before real art lands.
// Swap the internals here for PIXI.Assets.load() sprite-sheet loading —
// nothing outside this file needs to change.
export function createAssets(app: Application): AssetFactory {
  return {
    circle(radius: number, color: number, alpha = 1): Texture {
      const g = new Graphics().circle(0, 0, radius).fill({ color, alpha });
      return app.renderer.generateTexture(g);
    },
    roundedRect(w: number, h: number, radius: number, color: number): Texture {
      const g = new Graphics().roundRect(0, 0, w, h, radius).fill({ color });
      return app.renderer.generateTexture(g);
    },
  };
}
