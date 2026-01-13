import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
} from "discord.js";
import { dx } from "#/commands/dx";
import { ping } from "#/commands/ping";
import { roll } from "#/commands/roll";

export interface BotCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  followUp?: (
    interaction: ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction,
  ) => Promise<void>;
}

export const commands = new Map<string, BotCommand>([
  [ping.data.name, ping],
  [roll.data.name, roll],
  [dx.data.name, dx],
]);
