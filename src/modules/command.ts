import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

export function createCommand(
  name: string,
  description: string,
  executable: Command["execute"],
): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: executable,
  };
}
