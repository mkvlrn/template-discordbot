import { createCommand } from "#modules/command.ts";
import type { CommandInteraction } from "discord.js";

const name = "ping";
const description = "Ping the bot";
async function execute(interaction: CommandInteraction) {
  await interaction.reply("Pong!");
}

export const ping = createCommand(name, description, execute);
