import { err, ok, type Result } from "@mkvlrn/result";

export interface RollResult {
  die: number;
  quantity: number;
  values: number[];
  total: number;
}

export const maxDiceQuantity = 6;
export const diceFaces = [4, 6, 8, 10, 12, 20] as const;

export function rollDice(expression: string): Result<RollResult, Error> {
  const rollRegexp = new RegExp(`^([1-${maxDiceQuantity}])d(${diceFaces.join("|")})$`);
  const match = expression.match(rollRegexp);
  if (!match) {
    return err(new Error("Invalid dice roll expression"));
  }
  const [_, quantity, sides] = match.map(Number) as [never, number, number];
  const values = Array.from({ length: quantity }, () => Math.floor(Math.random() * sides) + 1);
  return ok({
    die: Number(sides),
    quantity: Number(quantity),
    values,
    total: values.reduce((a, b) => a + b),
  });
}
