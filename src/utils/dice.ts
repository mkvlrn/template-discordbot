import { errResult, okResult, type Result } from "@mkvlrn/result";

export interface RollResult {
  die: number;
  quantity: number;
  values: number[];
  total: number;
}

const d4 = 4;
const d6 = 6;
const d8 = 8;
const d10 = 10;
const d12 = 12;
const d20 = 20;

export const maxDiceQuantity = d6;
export const diceFaces = [d4, d6, d8, d10, d12, d20] as const;

export function rollDice(expression: string): Result<RollResult, Error> {
  const rollRegexp = new RegExp(`^([1-${maxDiceQuantity}])d(${diceFaces.join("|")})$`);
  const match = expression.match(rollRegexp);
  if (!match) {
    return errResult(new Error("Invalid dice roll expression"));
  }

  const [_, quantity, sides] = match.map(Number) as [never, number, number];
  const values = Array.from({ length: quantity }, () => Math.floor(Math.random() * sides) + 1);

  return okResult({
    die: Number(sides),
    quantity: Number(quantity),
    values,
    total: values.reduce((a, b) => a + b),
  });
}
