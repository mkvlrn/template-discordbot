import type { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { ping } from "#/commands/ping";

export interface BotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export const commands = new Map<string, BotCommand>([[ping.data.name, ping]]);
