import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

export const ping: BotCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping the bot"),
  execute,
};
