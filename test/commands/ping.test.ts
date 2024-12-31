import type { CommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { execute } from "~/commands/ping.js";

describe("ping command", () => {
  it("should reply with 'Pong!'", async () => {
    const mockInteraction = {
      reply: vi.fn(),
    } as unknown as CommandInteraction;

    await execute(mockInteraction);

    expect(mockInteraction.reply).toHaveBeenCalledWith("Pong!");
  });
});
