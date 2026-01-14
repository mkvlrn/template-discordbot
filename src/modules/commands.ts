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

export type FollowUpInteraction =
  | ButtonInteraction
  | AnySelectMenuInteraction
  | ModalSubmitInteraction;

const allCommands = [ping, roll, dx] as const satisfies readonly BotCommand[];

export interface BotCommand {
  data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  followUp?: (interaction: FollowUpInteraction) => Promise<void>;
}

export const commands = new Map<string, BotCommand>(allCommands.map((cmd) => [cmd.data.name, cmd]));
