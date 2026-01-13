import type {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { ping } from "#/commands/ping";
import { roll } from "#/commands/roll";

export interface BotCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export const commands = new Map<string, BotCommand>([
  [ping.data.name, ping],
  [roll.data.name, roll],
]);
