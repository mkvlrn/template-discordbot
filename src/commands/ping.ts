import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

export const ping: BotCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping the bot"),
  execute,
};
