interface MultiRoll {
  die: number;
  quantity: number;
  values: number[];
  total: number;
}

const rollRegexp = /^([1-6])d(4|6|8|10|12|20)$/;

export const diceFaces = [4, 6, 8, 10, 12, 20] as const;

export function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollFromExpression(expression: string): MultiRoll | false {
  const match = expression.match(rollRegexp);
  if (!match) {
    return false;
  }
  const [_, quantity, sides] = match;
  const values = Array.from({ length: Number(quantity) }, () => rollDie(Number(sides)));
  return {
    die: Number(sides),
    quantity: Number(quantity),
    values,
    total: values.reduce((a, b) => a + b),
  };
}
