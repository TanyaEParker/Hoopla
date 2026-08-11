import { Graphics } from "pixi.js";
import { Scene } from "../core/scene";
import { getAquarium } from "../helpers/backdrop";
import { DESIGN_WIDTH, DESIGN_HEIGHT, TankColors } from "../constants";
import { BubbleGameScene } from "./bubble-game-scene";
import { buildLabel } from "../helpers/buildLabel";
import type { Aquarium } from "../components/aquarium";
import { rgbStringToArray } from "../helpers/colors";
import { Tween } from "../helpers/tween";

const SWATCH_WIDTH = 90;
const SWATCH_HEIGHT = 90;
const SWATCH_RADIUS = 18; // corner radius, not size
const SWATCH_GAP = 45; // space between swatch edges, not centers
const spacing = SWATCH_WIDTH + SWATCH_GAP;

export class ColorPickerScene extends Scene {
  private aquarium : Aquarium|undefined = undefined;
  onEnter() {
    this.aquarium = getAquarium();
    this.addChild(buildLabel("CHANGE THE\nAQUARIUM COLOUR"));

    const totalWidth = (TankColors.length - 1) * spacing;
    const startX = DESIGN_WIDTH / 2 - totalWidth / 2;
    
    const swatches :Graphics[]=[];
    TankColors.forEach((color, i) => {
      const swatch = new Graphics()
        .roundRect(-SWATCH_WIDTH / 2, -SWATCH_HEIGHT / 2, SWATCH_WIDTH, SWATCH_HEIGHT, SWATCH_RADIUS)
        .fill({ color })
        .stroke({color:"rgb(91, 146, 214)",width:SWATCH_RADIUS/2}); 
      swatches.push(swatch);
      swatch.x = startX + i * spacing;
      swatch.y = DESIGN_HEIGHT * (i == 0 || i == TankColors.length-1 ?  0.275 : 0.25)
      swatch.eventMode = "static";
      swatch.cursor = "pointer";
      swatch.alpha = 0;
      swatch.on("pointertap",()=>
        {
          //refactor to have a nice move & fade out.
          for(let index of swatches){Tween.to(index,{alpha:0},0.25,Tween.easeInOutQuad)};
          if(this.aquarium)
          this.aquarium.tintAquarium(rgbStringToArray(color),1.5,()=>{this.manager.goTo(BubbleGameScene)});
        })
      this.addChild(swatch);
    });
    for(let swatch of swatches)
    {
      Tween.to(swatch,{alpha:1},0.25,Tween.easeInOutQuad);
    }
  }

  onExit() {
  }
}

