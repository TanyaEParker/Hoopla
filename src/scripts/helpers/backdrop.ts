import { Container, Graphics, Text } from "pixi.js";
import { DESIGN_WIDTH, DESIGN_HEIGHT, PALETTE } from "../constants";

export function buildBackdrop(): Container {
  const container = new Container();

  const sky = new Graphics()
    .rect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT * 0.55)
    .fill({ color: PALETTE.bgTop })
    .rect(0, DESIGN_HEIGHT * 0.55, DESIGN_WIDTH, DESIGN_HEIGHT * 0.45)
    .fill({ color: PALETTE.bgBottom });
  container.addChild(sky);

  const tank = new Graphics()
    .roundRect(60, DESIGN_HEIGHT * 0.28, DESIGN_WIDTH - 120, DESIGN_HEIGHT * 0.4, 40)
    .fill({ color: PALETTE.tankPurple, alpha: 0.85 });
  container.addChild(tank);

  return container;
}

export function buildLabel(text: string, y: number): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: "Arial",
      fontSize: 30,
      fontWeight: "bold",
      fill: 0xffffff,
      stroke: { color: 0x000000, width: 5 },
      align: "center",
    },
  });
  label.anchor.set(0.5);
  label.x = DESIGN_WIDTH / 2;
  label.y = y;
  return label;
}
