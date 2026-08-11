import { Application, Assets, TextureSource } from "pixi.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "./constants";
import { ctx } from "./core/context";
import { loadAssets } from "./core/assets";
import { Tween } from "./helpers/tween";
import { SceneManager } from "./core/scene-manager";
import { buildBackdrop } from "./helpers/backdrop";
import { LoadingScreenScene } from "./scenes/loading-screen-scene";

export let endUI : HTMLDivElement

async function boot() {
  const elem = document.getElementById('EndScreenWrapper');
  if(elem instanceof HTMLDivElement) endUI = elem;
  const app = new Application();
  await app.init({
    width: DESIGN_WIDTH,
    height: DESIGN_HEIGHT,
    antialias: false,
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
    if(!endUI)return
    console.log('resizing End UI')
      endUI.style.height = app.canvas.style.height;
      endUI.style.width = app.canvas.style.width;
  };

  window.addEventListener("resize", resize);

  resize();

  await Assets.load({
    alias:'pixelFont',
    src: new URL('../fonts/PixelifySans-VariableFont_wght.ttf',import.meta.url).href,
    data:{family:'pixelFont'}
  });
  ctx.app = app;

  TextureSource.defaultOptions.scaleMode = 'nearest';


  ctx.assets = await loadAssets();
  app.ticker.add(() => Tween.update(app.ticker.deltaMS));
  app.stage.addChild(buildBackdrop());
  const sceneManager = new SceneManager(app);
  sceneManager.goTo(LoadingScreenScene);
}

boot();
