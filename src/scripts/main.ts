import { Application } from "pixi.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT, PALETTE } from "./constants";
import { ctx } from "./core/context";
import { createAssets } from "./core/assets";
import { Tween } from "./core/tween";
import { SceneManager } from "./core/scene-manager";
import { CharacterSelectScene } from "./scenes/character-select-scene";

async function boot() {
  const app = new Application();
  await app.init({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    backgroundColor: PALETTE.bgBottom,
    antialias: true,
    resolution: Math.min(window.devicePixelRatio || 1, 2),
    autoDensity: true,
  });

  document.getElementById("game-container")!.appendChild(app.canvas);

  function resize() {
    const scale = Math.min(
      window.innerWidth / DESIGN_WIDTH,
      window.innerHeight / DESIGN_HEIGHT
    );
    app.canvas.style.width = `${DESIGN_WIDTH * scale}px`;
    app.canvas.style.height = `${DESIGN_HEIGHT * scale}px`;
  }
  window.addEventListener("resize", resize);
  resize();

  // Populate the shared context — scenes/UI pull app + assets from here.
  ctx.app = app;
  ctx.assets = createAssets(app);

  app.ticker.add(() => Tween.update(app.ticker.deltaMS));

  const sceneManager = new SceneManager(app);
  sceneManager.goTo(CharacterSelectScene);
}

boot();
