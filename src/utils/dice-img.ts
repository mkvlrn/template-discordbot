import { createCanvas, type SKRSContext2D } from "@napi-rs/canvas";
import type { RollResult } from "#utils/dice";

const boxSize = 80;
const padding = 10;

function drawBox(ctx: SKRSContext2D, x: number, y: number, value: string): void {
  ctx.fillStyle = "#4754F2";
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

function drawTotalBox(ctx: SKRSContext2D, x: number, y: number, value: string): void {
  const centerX = x + boxSize / 2;
  const centerY = y + boxSize / 2;
  const radius = boxSize / 2;

  // Black circle
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();

  // White border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.stroke();

  // White text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, centerX, centerY);
}

export function generateDiceImage(roll: RollResult): Buffer {
  const width = roll.values.length * (boxSize + padding) + padding + boxSize + padding;
  const height = boxSize + 20;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const yOffset = 10;

  roll.values.forEach((value, i) => {
    const x = i * (boxSize + padding) + padding;
    drawBox(ctx, x, yOffset, value.toString());
  });

  const totalX = roll.values.length * (boxSize + padding) + padding;
  drawTotalBox(ctx, totalX, yOffset, `${roll.total}`);

  return canvas.toBuffer("image/png");
}
