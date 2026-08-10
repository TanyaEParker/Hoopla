import { FillGradient, Text } from "pixi.js";
import { DESIGN_HEIGHT, DESIGN_WIDTH } from "../constants";

const [TextFill,StrokeFill] : [FillGradient,FillGradient] = [
  new FillGradient({
    type:'linear',
    start:{x:0,y:0},
    end:{x:0,y:1},
    colorStops:[
      {offset: 0, color:`rgb(255,255,255)`},
      {offset: 1, color:`rgb(103, 103, 103)`},
    ]
  }),
  new FillGradient({
    type:'linear',
    start:{x:0,y:0},
    end:{x:0,y:1},
    colorStops:[
      {offset: 0, color:`rgb(37, 37, 37)`},
      {offset: 1, color:`rgb(0, 0, 0)`},
    ]
  })
]

export function buildLabel(text: string, y=DESIGN_HEIGHT * 0.92): Text {
  const label = new Text({
    text,
    style: {
      fontFamily: "pixelFont",
      fontSize: 60,
      fontWeight: "bold",
      fill: TextFill,
      stroke: { fill: StrokeFill, width: 10 },
      align: "center",
    },
  });
  label.anchor.set(0.5);
  label.x = DESIGN_WIDTH / 2;
  label.y = y;
  return label;
}