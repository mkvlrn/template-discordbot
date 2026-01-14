export const diceFaces = [4, 6, 8, 10, 12, 20];

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}
