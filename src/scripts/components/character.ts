import { Container, Sprite } from "pixi.js";
import type { AssetAlias } from "../core/manifest";
import { Tween, type ActiveTween } from "../helpers/tween";
import { Timeline } from "../helpers/timeline";
import { ctx } from "../core/context";

export class Character extends Container{

    public characterSprite : Sprite;
    public characterHighlight : Sprite;
    private highlightAnim :ActiveTween;
    private isLocked : boolean;
    private lockSprite? : Sprite;
    private lockTimeline?: Timeline;
    constructor(character:AssetAlias,Locked:boolean){
        super();
        this.isLocked = Locked;
        
        this.characterHighlight = new Sprite(ctx.assets.get("characterHighlight"));
        this.characterHighlight.anchor.set(0.5)
        this.addChild(this.characterHighlight)
        this.characterHighlight.alpha = 0.5;
        this.characterHighlight.scale.set(1.5);

        this.highlightAnim = Tween.to(this.characterHighlight.scale,{x:1,y:1},1,Tween.easeInOutQuad,undefined,undefined,true,true);

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
        if(!this.lockSprite) return;
        
        const cycle = () => {
            this.lockTimeline = new Timeline();
            this.lockTimeline.add(this.lockSprite!, { rotation: 0.3 }, 0.3, Tween.easeOutQuad);
            this.lockTimeline.add(this.lockSprite!, { rotation: -0.3 }, 0.6, Tween.easeInOutQuad);
            this.lockTimeline.add(this.lockSprite!, { rotation: 0 }, 0.3, Tween.easeInQuad);
            this.lockTimeline.onComplete(cycle).play();
        };
        
        cycle();
    }

    destroy(options?: Parameters<Container["destroy"]>[0]) {
        if(this.highlightAnim) Tween.stop(this.highlightAnim);
        if (this.lockTimeline) this.lockTimeline.stop();
        super.destroy(options);
    }
}