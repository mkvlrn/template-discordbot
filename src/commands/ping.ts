import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

export const ping: BotCommand = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping the bot"),
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    await interaction.reply("Pong!");
  },
};
