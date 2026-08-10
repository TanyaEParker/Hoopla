import { Container, Sprite } from "pixi.js";
import type { AssetAlias } from "../core/manifest";
import { Tween } from "../helpers/tween";
import { ctx } from "../core/context";

export class Character extends Container{

    public characterSprite : Sprite;
    public characterHighlight : Sprite;
    private isLocked : boolean;
    private lockSprite? : Sprite;
    private lockAnim?: ReturnType<typeof Tween.to>;
    constructor(character:AssetAlias,Locked:boolean){
        super();
        this.isLocked = Locked;
        
        this.characterHighlight = new Sprite(ctx.assets.get("characterHighlight"));
        this.characterHighlight.anchor.set(0.5)
        this.addChild(this.characterHighlight)
        this.characterHighlight.alpha = 0.5;
        this.characterHighlight.scale.set(1.5);

        Tween.to(this.characterHighlight.scale,{x:1,y:1},1,Tween.easeInOutQuad,undefined,undefined,true,true);

        this.characterSprite = new Sprite(ctx.assets.get(character));
        this.characterSprite.anchor.set(0.5);
        this.characterSprite.eventMode = 'static';
        this.addChild(this.characterSprite);

        if(this.isLocked)
            {
                this.lockSprite = new Sprite(ctx.assets.get('lock'))
                this.lockSprite.anchor.set(0.5);
                
                this.lockSprite.scale.set(1.3);
                this.lockSprite.alpha = 0.75;
                
                this.addChild(this.lockSprite);
                
                this.characterSprite.tint = 'grey'
                this.playLockSwing();
            }
            else
            this.characterSprite.cursor = 'pointer';
                
    }

    private playLockSwing(){
        if(!this.lockSprite)return;
        const legTo = (rotation:number,duration:number,easing = Tween.easeInOutQuad,next?:()=>void,)=>
        {
            if(!this.lockSprite)return;
            this.lockAnim = Tween.to(
                this.lockSprite,
                {rotation},
                duration,
                easing,
                next
            );
        };
        const cycle = ()=>{
            legTo(0.3,0.3,Tween.easeOutQuad,()=>legTo(-0.3,0.6,Tween.easeInOutQuad,()=>legTo(0,0.3,Tween.easeInQuad,cycle)));
        };
        cycle();
    }

    destroy(options?: Parameters<Container["destroy"]>[0]) {
    console.log('stopping tween if active');
    if (this.lockAnim) Tween.stop(this.lockAnim);
    super.destroy(options);
}
}