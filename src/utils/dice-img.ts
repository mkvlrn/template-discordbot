import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";

const boxSize = 80;
const padding = 10;
const totalBoxWidth = 90;

function drawBox(ctx: SKRSContext2D, x: number, y: number, color: string, value: string): void {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, boxSize, boxSize, 12);
  ctx.fill();

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, x + boxSize / 2, y + boxSize / 2);
}

export function generateDiceImage(rolls: number[], total: number): Buffer {
  const width = rolls.length * (boxSize + padding) + padding + totalBoxWidth + padding;
  const height = 100;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  rolls.forEach((value, i) => {
    const x = i * (boxSize + padding) + padding;
    drawBox(ctx, x, 10, "#5865F2", value.toString());
  });

  const totalX = rolls.length * (boxSize + padding) + padding;
  drawBox(ctx, totalX, 10, "#ED4245", `${total}`);

  return canvas.toBuffer("image/png");
}
