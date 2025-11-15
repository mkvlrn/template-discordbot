import type { CommandInteraction } from "discord.js";

export async function ping(interaction: CommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}
