import type { CommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { type Command, createCommand } from "~/utils/create-command.js";

describe("createCommand", () => {
  vi.mock("discord.js", () => {
    return {
      // biome-ignore lint/style/useNamingConvention: type expects it
      SlashCommandBuilder: vi.fn().mockImplementation(() => {
        return {
          setName: vi.fn().mockReturnThis(),
          setDescription: vi.fn().mockReturnThis(),
        };
      }),
    };
  });

  it("should return a Command object with the correct structure", () => {
    const name = "test";
    const description = "test description";
    const execute = vi.fn();

    const command: Command = createCommand(name, description, execute);

    expect(command).toHaveProperty("data");
    expect(command).toHaveProperty("execute");
    expect(command.data.setName).toHaveBeenCalledWith(name);
    expect(command.data.setDescription).toHaveBeenCalledWith(description);
    expect(command.execute).toBe(execute);
  });

  it("should correctly assign the execute function", async () => {
    const name = "test";
    const description = "test description";
    const execute = vi.fn();

    const command: Command = createCommand(name, description, execute);

    const interaction = {} as CommandInteraction;
    await command.execute(interaction);

    expect(execute).toHaveBeenCalledWith(interaction);
  });
});
