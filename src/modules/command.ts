import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export type Action = (interaction: CommandInteraction) => Promise<void>;

export interface Command {
  data: SlashCommandBuilder;
  execute: Action;
}

export function createCommand(name: string, description: string, execute: Action): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute,
  };
}
