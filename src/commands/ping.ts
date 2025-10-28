import type { CommandInteraction } from "discord.js";
import { createCommand } from "#/modules/command";

async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

export const ping = createCommand("ping", "Ping the bot", execute);
