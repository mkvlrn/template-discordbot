import { describe, expect, it, vi } from "vitest";
import { loadEnvironment } from "~/utils/load-environment";

describe("loadEnvironment", () => {
  it("should return the environment variables when all are defined", () => {
    vi.stubEnv("BOT_TOKEN", "test-bot-token");
    vi.stubEnv("BOT_CLIENT_ID", "test-client-id");
    vi.stubEnv("SERVER_ID", "test-server-id");
    vi.stubEnv("DEV_MODE", "true");

    const environment = loadEnvironment();

    expect(environment).toStrictEqual({
      botToken: "test-bot-token",
      botClientId: "test-client-id",
      serverId: "test-server-id",
      devMode: true,
    });
  });

  it("should throw an error when any required environment variable is missing", () => {
    vi.stubEnv("BOT_TOKEN", "test-bot-token");
    vi.stubEnv("BOT_CLIENT_ID", "test-client-id");
    vi.stubEnv("SERVER_ID", "test-server-id");
    vi.stubEnv("DEV_MODE", undefined);

    const act = () => loadEnvironment();

    expect(act).toThrow("Missing required environment variables");
  });
});
