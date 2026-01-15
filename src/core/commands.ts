import { readdir } from "node:fs/promises";
import type {
  AnySelectMenuInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

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

export const commands = new Map<string, BotCommand>();

export function createBotCommand(command: BotCommand): void {
  commands.set(command.data.name, command);
}

export async function loadCommands(): Promise<void> {
  const files = await readdir(new URL("../commands", import.meta.url));
  await Promise.all(
    files
      .filter((file) => file.endsWith(".ts") || file.endsWith(".js"))
      .map((file) => import(`#/commands/${file.slice(0, -3)}`)),
  );
}
