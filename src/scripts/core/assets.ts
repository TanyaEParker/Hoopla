import {Assets, Rectangle, Texture } from "pixi.js";
import { Manifest, type AssetAlias } from "./manifest";

const BUBBLE_FRAME_SIZE = 32;

export interface AssetFactory{
  get(alias:AssetAlias):Texture,
  bubbleFrame(index:0|1|2):Texture
}

export async function loadAssets(): Promise<AssetFactory>{
  const entries = Object.entries(Manifest) as [AssetAlias,string][];

    await Assets.load(entries.map(([alias, src]) => ({ alias, src })));
    const bubbleSheet = await Assets.load<Texture>(Manifest.bubble);
    const bubbleFrames: Texture[] = [0, 1, 2].map(
      (i) =>
        new Texture({
          source: bubbleSheet.source,
          frame: new Rectangle(i * BUBBLE_FRAME_SIZE, 0, BUBBLE_FRAME_SIZE, BUBBLE_FRAME_SIZE),
        })
    );

  return {
    get(alias: AssetAlias): Texture {
      return Assets.get(alias);
    },
    bubbleFrame(index:0|1|2): Texture {
      return bubbleFrames[index];
    },
  };
}