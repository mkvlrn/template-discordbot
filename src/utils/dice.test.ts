import { describe, expect, test } from "bun:test";
import { rollDice } from "#/utils/dice";

const expectedDie = 6;
const expectedMaxRoll = 20;

describe("rollDice", () => {
  test("accepts valid dice expressions", () => {
    for (const expression of ["1d4", "2d6", "6d20"]) {
      const result = rollDice(expression);

      expect(result.isError).toBe(false);
    }
  });

  test("rejects invalid dice expressions", () => {
    for (const expression of ["d6", "0d6", "7d6", "1d5", "1d6!", "1D6", "abc"]) {
      const result = rollDice(expression);

      expect(result.isError).toBe(true);
    }
  });

  test("returns the parsed roll details", () => {
    const result = rollDice("2d6");

    expect(result.isError).toBe(false);

    if (!result.isError) {
      expect(result.value.die).toBe(expectedDie);
      expect(result.value.quantity).toBe(2);
      expect(result.value.values).toHaveLength(2);
      expect(result.value.total).toBe(result.value.values.reduce((sum, value) => sum + value, 0));
    }
  });

  test("rolls values within the die bounds", () => {
    const result = rollDice("6d20");

    expect(result.isError).toBe(false);

    if (!result.isError) {
      for (const value of result.value.values) {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(expectedMaxRoll);
      }
    }
  });

  test("returns an error for an invalid expression", () => {
    const result = rollDice("invalid");

    expect(result.isError).toBe(true);

    if (result.isError) {
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error.message).toBe("Invalid dice roll expression");
    }
  });
});
