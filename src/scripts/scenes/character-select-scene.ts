import { Scene } from "../core/scene";
import { Tween } from "../helpers/tween";
import { setBackdropCharacter } from "../helpers/backdrop";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { Character } from "../components/character";
import type { AssetAlias } from "../core/manifest";
import { buildLabel } from "../helpers/buildLabel";
import { ColorPickerScene } from "./color-picker-scene";

interface CharacterData {
  alias :AssetAlias,
  isLocked : boolean,
  x:number,
  y:number
}

const CHARACTERS:CharacterData[]=[
  {alias:"mantaBasic",isLocked:true,x:DESIGN_WIDTH*0.35,y:DESIGN_HEIGHT*0.2},
  {alias:"turtleBasic",isLocked:false,x:DESIGN_WIDTH*0.65,y:DESIGN_HEIGHT*0.2},
  {alias:"mermaidBasic",isLocked:true,x:DESIGN_WIDTH*0.2,y:DESIGN_HEIGHT*0.35},
  {alias:"dogBasic",isLocked:true,x:DESIGN_WIDTH*0.5,y:DESIGN_HEIGHT*0.35},
  {alias:"sharkBasic",isLocked:true,x:DESIGN_WIDTH*0.80,y:DESIGN_HEIGHT*0.35},
]

export class CharacterSelectScene extends Scene {
  onEnter() {
    this.addChild(buildLabel("PLAY TO\nUNLOCK MORE"));

    for(let index of CHARACTERS)
    {
      const character = new Character(index.alias,index.isLocked);
      this.addChild(character);
      character.x = index.x;
      character.y = index.y;

      if(!index.isLocked)
      {
        character.characterSprite.on("pointertap",()=>
          {
            setBackdropCharacter(index.alias);
            this.manager.goTo(ColorPickerScene)
            
          })
      }

      character.scale.set(0);
      Tween.to(character.scale,{x:0.9,y:0.9},0.5,Tween.easeOutBack);
    }
  }

}