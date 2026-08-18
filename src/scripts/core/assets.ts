import {Assets, Rectangle, Texture } from "pixi.js";
import { AudioManifest, Manifest, type AssetAlias, type AudioAlias } from "./manifest";
import '@pixi/sound';
import { sound, type Sound } from "@pixi/sound";

const BUBBLE_FRAME_SIZE = 32;

export interface AssetFactory{
  get(alias:AssetAlias):Texture,
  bubbleFrame(index:0|1|2):Texture,
  getSound(alias:AudioAlias,loop?:boolean):void,
}

export async function loadAssets(): Promise<AssetFactory>{
  const entries = Object.entries(Manifest) as [AssetAlias,string][];
  const sounds = Object.entries(AudioManifest) as [AudioAlias,string][];

  await Assets.load(entries.map(([alias, src]) => ({ alias, src })));
    // Load audio files — add them to sound library
  for (const [alias, src] of sounds) {
    if (src) {
      await sound.add(alias, src);
    }
  }

    const bubbleSheet = await Assets.load<Texture>(Manifest.bubble);
    const bubbleFrames: Texture[] = [0, 1, 2].map(
      (i) =>
        new Texture({
          source: bubbleSheet.source,
          frame: new Rectangle(i * BUBBLE_FRAME_SIZE, 0, BUBBLE_FRAME_SIZE, BUBBLE_FRAME_SIZE),
        })
    );

  return {
    getSound(alias:AudioAlias,loopState=false): void{
      sound.play(alias,{loop:loopState})
    },
    get(alias: AssetAlias): Texture {
      return Assets.get(alias);
    },
    bubbleFrame(index:0|1|2): Texture {
      return bubbleFrames[index];
    },
  };
}