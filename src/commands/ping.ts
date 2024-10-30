import type { CommandInteraction } from "discord.js";

export const name = "ping";

export const description = "Ping the bot";

export async function execute(interaction: CommandInteraction) {
  await interaction.reply("Pong!");
}
