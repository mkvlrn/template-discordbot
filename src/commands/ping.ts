import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

const data = new SlashCommandBuilder().setName("ping").setDescription("Ping the bot");

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

export const ping = { data, execute } satisfies BotCommand;
