import type { Application } from "pixi.js";
import type { AssetFactory } from "./assets";


// Populated once in main.ts after app.init() resolves. Everything else
// (scenes, UI components) imports `ctx` and reads from it — avoids
// threading `app` through every constructor.
export const ctx: { app: Application; assets: AssetFactory } = {} as any;
