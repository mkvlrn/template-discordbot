import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createBotCommand } from "#/modules/commands";

const data = new SlashCommandBuilder().setName("ping").setDescription("Ping the bot");

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

createBotCommand({ data, execute });
