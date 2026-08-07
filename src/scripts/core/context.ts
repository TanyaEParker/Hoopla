import type { Application, Texture } from "pixi.js";

export interface AssetFactory {
  circle(radius: number, color: number, alpha?: number): Texture;
  roundedRect(w: number, h: number, radius: number, color: number): Texture;
}

// Populated once in main.ts after app.init() resolves. Everything else
// (scenes, UI components) imports `ctx` and reads from it — avoids
// threading `app` through every constructor.
export const ctx: { app: Application; assets: AssetFactory } = {} as any;
