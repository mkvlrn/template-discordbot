import type { CommandInteraction } from "discord.js";
import { createCommand } from "~/modules/command.js";

async function execute(interaction: CommandInteraction): Promise<void> {
  await interaction.reply("Pong!");
}

// biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
export const ping = createCommand("ping", "Ping the bot", execute);
