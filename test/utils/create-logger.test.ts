import { describe, expect, it } from "vitest";
import { createLogger } from "~/utils/create-logger.js";

describe("createLogger", () => {
  it("should return a logger with error level and file transport in production", () => {
    const logger = createLogger(false);

    expect(logger).toHaveProperty("info");
    expect(logger).toHaveProperty("error");
    expect(logger).toHaveProperty("debug");
  });

  it("should return a logger with trace level and pretty transport in development", () => {
    const logger = createLogger(true);

    expect(logger).toHaveProperty("info");
    expect(logger).toHaveProperty("error");
    expect(logger).toHaveProperty("debug");
  });
});
