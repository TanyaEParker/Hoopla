import { Container, Sprite } from "pixi.js";
import { tweenTint, } from "../helpers/tint-tween";
import { Tween } from "../helpers/tween";
import { ctx } from "../core/context";
import type { AssetAlias } from "../core/manifest";
import { rgbStringToArray, TankColors } from "../helpers/colors";

interface AquariumElement{
    alias:AssetAlias,
    tintable:boolean
}

const LAYERS : AquariumElement[] = [
    {alias:'shellBack',tintable:false},
    {alias:'tankBack',tintable:false},
    {alias:'tank',tintable:true},
    {alias:'tankContent',tintable:false},
    {alias:'dial',tintable:false},
    {alias:'screen',tintable:true},
]

export class Aquarium extends Container{

    private tintables : Sprite[] = [];

    private activeTweens = new Map<Sprite, ReturnType<typeof tweenTint>>();
    constructor() {
        super();
        for(const index of LAYERS){
            const sprite = new Sprite(ctx.assets.get(index.alias));
            sprite.anchor.set(0.5);
            this.addChild(sprite)
            if(index.tintable)
            {
                this.tintables.push(sprite)
                sprite.tint = TankColors[0];
            }
        }
        
    }

    public tintAquarium(tintColour:[number,number,number],duration:number,onComplete?:()=>void)
    {
        //clunky, but does not lerp to the starting tank colour.
        if(tintColour.toString()===rgbStringToArray(TankColors[0]).toString()){onComplete?.();return;}
        if(this.tintables.length == 0){onComplete?.();return;}
        let remaining = this.tintables.length;
        for(const index of this.tintables)
        {
            //stop a tween in progress if it's happening
            const currentTween = this.activeTweens.get(index);
            if(currentTween) Tween.stop(currentTween);
            
            //tween to new colour
            const tween = tweenTint(index,tintColour,duration,Tween.easeInOutQuad,()=>
                {
                    this.activeTweens.delete(index);
                    remaining--;
                    if(remaining === 0)onComplete?.();
                    
                })
            this.activeTweens.set(index,tween);
        };
    };
};