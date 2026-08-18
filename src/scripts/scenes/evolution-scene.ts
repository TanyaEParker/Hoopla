import {Sprite, Text } from "pixi.js";
import { Scene } from "../core/scene";
import { ctx } from "../core/context";
import { Tween } from "../helpers/tween";
import { Timeline } from "../helpers/timeline";
import { EvolutionRope } from "../components/evolution-rope";
import { DESIGN_WIDTH, DESIGN_HEIGHT } from "../constants";
import { buildLabel } from "../helpers/buildLabel";
import { EndCardScene } from "./end-card-scene";
import type { AssetAlias } from "../core/manifest";
import { Firework } from "../components/firework";

const SparkleSize = 0.25;

export class EvolutionScene extends Scene {
  private particleCount = 12;
  private particles : Sprite[] = [];
  private labelCopy:Text|undefined = undefined;
  private activeTweens: ReturnType<typeof Tween.to>[] = [];
  private activeTimelines: Timeline[] = [];

  private basicSprite : Sprite|null = null;
  private evolvedSprite : Sprite|null = null;
  private basicSpriteMask : Sprite|null = null;
  private evolvedSpriteMask : Sprite|null = null;
  private basicRope : EvolutionRope|null = null;
  private evolvedRope : EvolutionRope|null = null;

  private createSprite(alias:AssetAlias):Sprite{
    const sprite = new Sprite(ctx.assets.get(alias));
    sprite.anchor.set(0.5);
    sprite.x = DESIGN_WIDTH / 2;
    sprite.y = DESIGN_HEIGHT * 0.665;
    this.addChild(sprite)
    return sprite;
  }
  private createRope(outlineMask:Sprite):EvolutionRope{
    const rope = new EvolutionRope(outlineMask.width+20,outlineMask.height+20);
    rope.x = DESIGN_WIDTH / 2;
    rope.y = DESIGN_HEIGHT * 0.67;
    rope.alpha = 0;
    rope.outline.mask = outlineMask;
    this.addChild(rope)
    return rope;
  }
  onEnter() {

    if(!this.labelCopy){
      this.labelCopy = (buildLabel("EVOLUTION!"));
      this.addChild(this.labelCopy);
    }
    // RemoveActiveCharacter();
    const firework = new Firework("firework","perlinMap");
    firework.position.set(DESIGN_WIDTH*0.5,DESIGN_HEIGHT*0.67);
    this.addChild(firework);
    this.createParticles();

    this.basicSprite = this.createSprite("turtleBasic");

    this.basicSpriteMask = this.createSprite("turtleBasicMask");
    this.basicSpriteMask.renderable = false;

    this.basicRope = this.createRope(this.basicSpriteMask);
    
    this.evolvedSprite = this.createSprite("turtleEvolved");
    this.evolvedSprite.visible = false;
    
    this.evolvedSpriteMask = this.createSprite("turtleEvolvedMask");
    this.evolvedSpriteMask.renderable = false;
    
    this.evolvedRope = this.createRope(this.evolvedSpriteMask);
    this.evolvedRope.scale.set(0);
    this.evolvedRope.visible = false;
    
    
    // Particle burst helper — fires particles in random spray
    const spawnParticles = (x: number, y: number, count = 1) => {
      if(count > 0)
      {
        // for(let i=0;i<)
      }
      for (let i = 0; i < count; i++) {
        const p = new Sprite(ctx.assets.get("sparkle"));
        p.anchor.set(0.5);
        
        const startAngle = Math.random() * Math.PI * 2;
        const startDist = Math.random() * 20;
        p.x = x + Math.cos(startAngle) * startDist;
        p.y = y + Math.sin(startAngle) * startDist;
        
        p.scale.set(SparkleSize * Math.random());
        
        this.addChild(p);
        
        const shootAngle =  (Math.PI * 2 * i) / count;
        const shootDist = 300;
        ctx.assets.getSound('sparkleTone');
        const tween = Tween.to(
          p,
          { x: x + Math.cos(shootAngle) * shootDist, y: y + Math.sin(shootAngle) * shootDist, alpha: 0,rotation:90},
          0.7,
          Tween.easeOutQuad,
          () => { if (p.parent) this.removeChild(p); },
          () => {p.scale.set(p.scale.x / 0.99);
          }
        );
        this.activeTweens.push(tween);
      }
    };
    
    //fade bsic rope mask in, hide base asset
    const stage1 = new Timeline();
    stage1.add(this.basicRope, { alpha: 1 }, 1, Tween.easeInOutQuad);
    stage1.play();
    stage1.onComplete(()=>stage2());
    this.activeTimelines.push(stage1);
    
    // tween between the rope assets
    const stage2 = () => {
      if(!this.basicSprite||!this.basicRope||!this.evolvedRope)return
        this.basicRope.alpha = 1;
        this.basicSprite.visible = false;
        this.evolvedRope.visible = true;

        spawnParticles(this.basicSprite.x,this.basicSprite.y,12)

        const scaleTween1 = Tween.to(this.evolvedRope.scale,{x:1,y:1},0.5,Tween.easeInOutQuad)
        const tween = Tween.to(this.evolvedRope,{alpha:1},0.5,Tween.easeInOutQuad,()=>firework.PlayEffect(stage3Start));
        this.activeTweens.push(scaleTween1);
        this.activeTweens.push(tween);
    }
    //fade evolved rope asset out
    const stage3Start = () => {
      if(!this.basicRope||!this.evolvedSprite)return

      this.basicRope.visible = false;
      this.evolvedSprite.visible = true;

      const stage2 = Tween.to(this.evolvedRope,{alpha:0},1,Tween.easeOutQuad,()=>{
        if(this.labelCopy) this.labelCopy.text = 'WOW!'
        stage4Start();
      });
      this.activeTweens.push(stage2);
    };

    // pause for imapact. Passive firework pulse
    const stage4Start = () => {
      setTimeout(() => {
        this.manager.goTo(EndCardScene);
      }, 570);
    };
  }
  private createParticles(){
    for(let i =0;i <= this.particleCount; i++)
    {
       const particle =  new Sprite(ctx.assets.get("sparkle"));
       particle.anchor.set(0.5);
       particle.alpha = 0;
       particle.x = DESIGN_WIDTH/2
       particle.y = DESIGN_HEIGHT * 0.665;
       this.particles.push(particle);
       this.addChild(particle);
    }
  };
  onExit() {
    if (this.manager.hud.heart)
      {
        this.manager.hud.heart.destroy();
        this.manager.hud.heart = null;
      }

    this.activeTweens.forEach(t => Tween.stop(t));
    this.activeTweens = [];
    
    this.activeTimelines.forEach(tl => tl.stop());
    this.activeTimelines = [];
  }
}
    
    