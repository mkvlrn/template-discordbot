import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ping } from "#/commands/ping";

type Execute = (interaction: CommandInteraction) => Promise<void>;

interface BotCommand {
  data: SlashCommandBuilder;
  execute: Execute;
}

function createBotCommand(name: string, description: string, executable: Execute): BotCommand {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: executable,
  };
}

const commands = new Map<string, BotCommand>([
  ["ping", createBotCommand("ping", "Ping the bot", ping)],
]);

export { type BotCommand, commands };
