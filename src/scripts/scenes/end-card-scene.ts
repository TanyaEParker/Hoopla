import { Sprite, Text } from "pixi.js";
import { Scene } from "../core/scene";
import { ctx } from "../core/context";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { CharacterSelectScene } from "./character-select-scene";
import { buildLabel } from "../helpers/buildLabel";
import { getAquarium, toggleLogo } from "../helpers/backdrop";
import { endUI } from "../main";
import { Tween } from "../helpers/tween";

export class EndCardScene extends Scene {
  onEnter() {
    this.addChild(buildLabel("MORE UNLOCKED!",DESIGN_HEIGHT*0.95));

    toggleLogo(false);
    const Aquarium = getAquarium();
    if(endUI)endUI.style.display = 'flex';
    Aquarium.visible = false;
  
    // const Character = getCharacter();
    // if(Character)
    // Tween.to(Character,{alpha:0},1,Tween.easeInOutQuad)

    const replay = new Sprite(ctx.assets.get('button'));
    replay.anchor.set(0.5);
    replay.scale.set(3);
    replay.x = DESIGN_WIDTH * 0.25;
    replay.y = DESIGN_HEIGHT * 0.86;
    replay.eventMode = "static";
    replay.cursor = "pointer";
    replay.tint = "rgb(149, 0, 255)"
    replay.on("pointertap", () =>
      {
        ctx.assets.getSound('button');
        Tween.to(replay.scale,{x:2.5,y:2.5},0.2,Tween.easeInOutQuad,()=>{
          if(endUI)endUI.style.display = 'none'
          Aquarium.visible = true;
          toggleLogo(true);
          this.manager.goTo(CharacterSelectScene);
        });
      });
    this.addChild(replay);
    const replayText = new Text({text:'Replay'.toUpperCase(),style: {fontFamily: "pixelFont",fontSize: 30,fontWeight: "bold",fill: 'rgb(255,255,255)',align: "center",}});
    replayText.anchor.set(0.5),
    replayText.x = DESIGN_WIDTH * 0.25;
    replayText.y = DESIGN_HEIGHT * 0.86;
    this.addChild(replayText);
    const learnMore = new Sprite(ctx.assets.get('button'));
    learnMore.anchor.set(0.5);
    learnMore.scale.set(3);
    learnMore.x = DESIGN_WIDTH * 0.75;
    learnMore.y = DESIGN_HEIGHT * 0.86;
    learnMore.eventMode = "static";
    learnMore.cursor = "pointer";
    learnMore.tint = "rgb(255, 191, 0)"
    // Clickthrough — real ad networks expose their own API for this
    // (e.g. MRAID's mraid.open(), or a network-specific click macro).
    learnMore.on("pointertap", () => {
      ctx.assets.getSound('button');
      Tween.to(learnMore.scale,{x:2.5,y:2.5},0.2,Tween.easeInOutQuad,()=>{
        window.open('https://play.bitzee.com/bitzee-aquarium','_blank')
      },undefined,undefined,true)
    });
    this.addChild(learnMore);
    const learnMoreText = new Text({text:'learn\nmore'.toUpperCase(),style: {fontFamily: "pixelFont",fontSize: 30,fontWeight: "bold",fill: 'rgb(255,255,255)',align: "center",}});
    learnMoreText.anchor.set(0.5),
    learnMoreText.x = DESIGN_WIDTH * 0.75;
    learnMoreText.y = DESIGN_HEIGHT * 0.86;
    this.addChild(learnMoreText);
  }

  onExit(): void {
  }
}
