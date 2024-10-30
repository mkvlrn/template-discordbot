import { CommandInteraction } from "discord.js";
import { describe, expect, it, vi } from "vitest";
import { Command, createCommand } from "~/utils/create-command";

describe("createCommand", () => {
  vi.mock("discord.js", () => {
    return {
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
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(command.data.setName).toHaveBeenCalledWith(name);
    // eslint-disable-next-line @typescript-eslint/unbound-method
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
