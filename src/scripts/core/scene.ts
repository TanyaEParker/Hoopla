import { Container } from "pixi.js";
import type { SceneManager } from "./scene-manager";

export abstract class Scene extends Container {
  constructor(protected manager: SceneManager) {
    super();
  }
  onEnter(): void {}
  onExit(): void {}
  update(_deltaMS: number): void {}
}

export type SceneClass = new (manager: SceneManager) => Scene;
