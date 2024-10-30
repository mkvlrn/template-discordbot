import type { CommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { execute } from "~/commands/ping";

describe("ping command", () => {
  it("should reply with 'Pong!'", async () => {
    const mockInteraction = {
      reply: vi.fn(),
    } as unknown as CommandInteraction;

    await execute(mockInteraction);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockInteraction.reply).toHaveBeenCalledWith("Pong!");
  });
});
