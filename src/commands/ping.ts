import type { CommandInteraction } from "discord.js";
import { createCommand } from "~/modules/command";

const name = "ping";
const description = "Ping the bot";
async function execute(interaction: CommandInteraction) {
  await interaction.reply("Pong!");
}

export const command = createCommand(name, description, execute);
