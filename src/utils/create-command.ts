import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export function createCommand(
  name: string,
  description: string,
  execute: (interaction: CommandInteraction) => Promise<void>,
): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute,
  };
}
