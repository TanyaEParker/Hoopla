import { Container, Sprite } from "pixi.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { Aquarium } from "../components/aquarium";
import { ctx } from "../core/context";
import { Tween } from "./tween";
import type { AssetAlias } from "../core/manifest";
import { DEBUG, debugDot } from "./debug";

interface BackdropElement {
  elementType:typeof Sprite | typeof Aquarium,
  alias?: AssetAlias;
  x?: number;
  y?: number;
  anchorX?: number;
  anchorY?: number;
  scale?: number;
  width?: number;
  height?: number;
  tint?: string;
  alpha?: number;
  popIn?: boolean;
}

const Elements: BackdropElement[] = [
  {elementType:Sprite,alias:"background",scale:3},
  {elementType:Sprite,anchorY:0,anchorX:0.5,alias:"horizon",width:DESIGN_WIDTH,height:1600,y:-800,tint:'rgb(15, 146, 232)',alpha:0.75},
  {elementType:Sprite,alias:"ground",anchorX:0.5,anchorY:1,scale:2,x:DESIGN_WIDTH*0.5,y:DESIGN_HEIGHT},
  {elementType:Sprite,alias:"dunesRight",anchorX:1,anchorY:1,scale:2.5,x:DESIGN_WIDTH,y:DESIGN_HEIGHT*0.815},
  {elementType:Sprite,alias:"horizon",width:DESIGN_WIDTH,height:70,y:DESIGN_HEIGHT*0.78,tint:'rgb(168, 246, 246)'},
  {elementType:Sprite,alias:"logo",anchorX:0.5,anchorY:0.5,x:DESIGN_WIDTH*0.5,y:DESIGN_HEIGHT*0.075,scale:0.01,popIn:true},
  // need to create a persisent reference to the aquarium for the colour select screen
  {elementType:Sprite,alias:"rock",anchorX:0.5,anchorY:0.5,x:DESIGN_WIDTH*.925,y:DESIGN_HEIGHT*.8,scale:2,tint:"rgb(128,128,128)"},
  {elementType:Sprite,alias:"blueCoral",anchorX:0.5,anchorY:1,x:DESIGN_WIDTH*0.05,y:DESIGN_HEIGHT*0.825,scale:2},
  {elementType:Aquarium,x:DESIGN_WIDTH*0.5,y:DESIGN_HEIGHT*0.65,scale:1.1},
  {elementType:Sprite,alias:"rock",anchorX:0.5,anchorY:0.5,x:DESIGN_WIDTH*0.15,y:DESIGN_HEIGHT*0.8375,scale:2,tint:"rgb(128,128,128)"},
  {elementType:Sprite,alias:"rock",anchorX:0.5,anchorY:0.5,x:DESIGN_WIDTH*0.65,y:DESIGN_HEIGHT*0.925,tint:"rgb(128,128,128)"},
  {elementType:Sprite,alias:"blueCoral",anchorX:0.5,anchorY:1,x:DESIGN_WIDTH*0.825,y:DESIGN_HEIGHT*0.875,scale:1.75},
];

let [cachedBackdrop,cachedAquarium,cachedCharacter,cachedLogo] : [Container|null,Aquarium|null,Sprite|null,Sprite|null] = [null,null,null,null];
let activeCharacterTweens: ReturnType<typeof Tween.to>[] = [];
export function buildBackdrop(): Container {
  if(cachedBackdrop)return cachedBackdrop;
  const container = new Container();
  cachedBackdrop = container;
  for(let index of Elements)
  {
    //sprites should always have an alias but I don't want to make the key mandatory
    const elem = index.elementType == Sprite && index.alias ? new Sprite(ctx.assets.get(index.alias)) : new Aquarium();
    if(index.alias == 'logo' && elem instanceof Sprite)cachedLogo = elem;

    elem.x = index.x ||0;
    elem.y = index.y||0;

    if(elem instanceof Sprite && index.anchorX && index.anchorY)
    elem.anchor.set(index.anchorX,index.anchorY);

    elem.scale.set(index.scale||1);
    elem.width = index.width||elem.width;
    elem.height = index.height||elem.height;
    elem.tint = index.tint||'white';
    elem.alpha = index.alpha||1;
  
    if(!!index.popIn)
    {
      Tween.to(elem.scale,{x:1,y:1},0.65,Tween.easeOutElastic);
    }
    if(elem instanceof Aquarium)
    cachedAquarium = elem;
    container.addChild(elem);
  }

  return container;
}
export function toggleLogo(state:boolean):void{
  if(!cachedLogo)return;
  console.log('removing cached logo')
  cachedLogo.visible = state;
};

export function getAquarium() : Aquarium{
  if(!cachedAquarium){
    throw new Error('aquarium called before backdrop constructed');
  }
  return cachedAquarium;
};

export function getCharacter() : Sprite{
  if(!cachedCharacter){
    throw new Error('aquarium called before backdrop constructed');
  }
  return cachedCharacter;
};
const MoveAnimLength = 7;
export function setBackdropCharacter(alias: AssetAlias): Sprite {
  const backdrop = buildBackdrop();
 if (cachedCharacter) {
    activeCharacterTweens.forEach((t) => Tween.stop(t));
   activeCharacterTweens = [];
   backdrop.removeChild(cachedCharacter);
   backdrop.removeChild(cachedCharacter);
   cachedCharacter.destroy();
  }
  const character = new Sprite(ctx.assets.get(alias));
  character.anchor.set(0.5);
  character.x = DESIGN_WIDTH / 2;
  character.y = DESIGN_HEIGHT * 0.67;
  
  if(DEBUG)
  {
    // character.visible = false;
    backdrop.addChild(debugDot(DESIGN_WIDTH*0.2,character.y));
    backdrop.addChild(debugDot(DESIGN_WIDTH*0.5,character.y));
    backdrop.addChild(debugDot(DESIGN_WIDTH*0.8,character.y));
  };

  backdrop.addChild(character);
  cachedCharacter = character;
  moveCharacter();
  return character;
}

function moveCharacter()
{
  if(!cachedCharacter)return;
  const moveTo = (x:number,duration:number,easing = Tween.easeInOutQuad,next?:()=>void,)=>{activeCharacterTweens.push(Tween.to(cachedCharacter,{x},duration,easing,next))};
  const cycle = ()=>{moveTo(DESIGN_WIDTH*0.8,MoveAnimLength*0.5,Tween.easeOutQuad,()=>{activeCharacterTweens.push(Tween.to(cachedCharacter.scale,{x:-1},0.1,Tween.easeInOutQuad));moveTo(DESIGN_WIDTH*0.2,MoveAnimLength,Tween.easeInOutQuad,()=>{activeCharacterTweens.push(Tween.to(cachedCharacter.scale,{x:1},0.1,Tween.easeInOutQuad));moveTo(DESIGN_WIDTH*0.5,MoveAnimLength*0.5,Tween.easeInQuad,cycle)})})};
  
  cycle();

  activeCharacterTweens.push(Tween.to(cachedCharacter,{y:DESIGN_HEIGHT * 0.665},0.1,Tween.easeInOutQuad,undefined,undefined,true,true));
}

export function attachBackdrop(scene:Container):void{
  scene.addChildAt(buildBackdrop(),0);
}

export function detachBackdrop(scene: Container): void {
  if (cachedBackdrop && cachedBackdrop.parent === scene) {
    scene.removeChild(cachedBackdrop);
  }
}
