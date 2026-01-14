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

export type Data =
  | SlashCommandBuilder
  | SlashCommandOptionsOnlyBuilder
  | SlashCommandSubcommandsOnlyBuilder;

export type FollowUpInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;

export interface BotCommand {
  data: Data;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  followUp?: (interaction: FollowUpInteraction) => Promise<void>;
}

const allCommands = [ping, roll, rollPanel, rollPlus] as const satisfies readonly BotCommand[];

export const commands = new Map<string, BotCommand>(allCommands.map((cmd) => [cmd.data.name, cmd]));
