import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";
import { ping } from "#/commands/ping";
import { roll } from "#/commands/roll";
import { rollPanel } from "#/commands/roll-panel";
import { rollPlus } from "#/commands/roll-plus";

export type BotCommandData =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export type FollowUpInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;

export interface BotCommand {
  data: BotCommandData;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  followUp?: (interaction: FollowUpInteraction) => Promise<void>;
}

export const commands = new Map<string, BotCommand>([
  ["ping", ping],
  ["roll", roll],
  ["roll-plus", rollPlus],
  ["roll-panel", rollPanel],
]);
