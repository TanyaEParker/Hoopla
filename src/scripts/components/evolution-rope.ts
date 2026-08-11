import { Container, Graphics } from "pixi.js";
import { Tween } from "../helpers/tween";

// Square outline using Graphics — jiggle deforms via redrawing with offset vertices.
// Much simpler than mesh geometry, and handles the shimmer effect cleanly.
export class EvolutionRope extends Container {
   outline: Graphics;
  private fillColor: number;
  private baseVertices: Array<[number, number]>;
  private restoreTween?: ReturnType<typeof Tween.to>;

  constructor(width: number, height: number, fillColor = 0xffffff) {
    super();
    this.width = width;
    this.height = height;
    this.fillColor = fillColor;
    
    // Define square outline vertices (centered on 0,0)
    const w2 = width / 2;
    const h2 = height / 2;
    this.baseVertices = [
      [-w2, -h2], // TL
      [0, -h2],   // T-mid
      [w2, -h2],  // TR
      [w2, 0],    // R-mid
      [w2, h2],   // BR
      [0, h2],    // B-mid
      [-w2, h2],  // BL
      [-w2, 0],   // L-mid
    ];

    this.outline = new Graphics();
    this.addChild(this.outline);
    
    this.redraw(this.baseVertices);
  }
 getMask(): Graphics {
    return this.outline;
  }
private redraw(vertices: Array<[number, number]>) {
  this.outline.clear();
  // Draw filled white rectangle, not stroked outline
  const minX = Math.min(...vertices.map(v => v[0]));
  const maxX = Math.max(...vertices.map(v => v[0]));
  const minY = Math.min(...vertices.map(v => v[1]));
  const maxY = Math.max(...vertices.map(v => v[1]));
  
  this.outline.rect(minX, minY, maxX - minX, maxY - minY);
  this.outline.fill({ color: 0xffffff});
}

  jiggleVertices(amount: number, duration: number) {
    if (this.restoreTween) Tween.stop(this.restoreTween);

    // Left side: indices 0, 7
    // Right side: indices 2, 3, 4
    const leftIndices = [0, 7];
    const rightIndices = [2, 3, 4];

    // Create jiggled copy of vertices
    const jiggled = this.baseVertices.map(v => [...v] as [number, number]);
    
    for (const i of leftIndices) {
      jiggled[i][0] -= (Math.random() - 0.5) * amount;
    }
    for (const i of rightIndices) {
      jiggled[i][0] += (Math.random() - 0.5) * amount;
    }

    this.redraw(jiggled);

    // Restore vertices smoothly
    const obj = { t: 0 };
    this.restoreTween = Tween.to(
      obj,
      { t: 1 },
      duration,
      Tween.easeOutQuad,
      () => this.redraw(this.baseVertices),
      () => {
        // Interpolate between jiggled and base on each frame
        const lerped = this.baseVertices.map((v, i) => [
          v[0] + (jiggled[i][0] - v[0]) * (1 - obj.t),
          v[1] + (jiggled[i][1] - v[1]) * (1 - obj.t),
        ] as [number, number]);
        this.redraw(lerped);
      }
    );
  }

  destroy(options?: Parameters<Container["destroy"]>[0]) {
    if (this.restoreTween) Tween.stop(this.restoreTween);
    super.destroy(options);
  }
}