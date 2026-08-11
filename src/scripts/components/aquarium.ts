import { Container, Sprite } from "pixi.js";
import { tweenTint, } from "../helpers/tint-tween";
import { Tween } from "../helpers/tween";
import { ctx } from "../core/context";
import type { AssetAlias } from "../core/manifest";
import { rgbStringToArray } from "../helpers/colors";
import { TankColors } from "../constants";

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

    public aquariumWidth:number=0;
    private tintables : Sprite[] = [];
    private currentTankColour:string ='';
    private activeTweens = new Map<Sprite, ReturnType<typeof tweenTint>>();
    constructor() {
        super();
        this.currentTankColour = TankColors[0].toString();
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
        this.aquariumWidth = this.tintables[0].width;
        
    }

    public tintAquarium(tintColour:[number,number,number],duration:number,onComplete?:()=>void)
    {
        if(tintColour.toString()===this.currentTankColour){onComplete?.();return;}
        this.currentTankColour = tintColour.toString();
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