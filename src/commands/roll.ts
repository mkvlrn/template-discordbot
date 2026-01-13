import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

function rollDie(sides: number): number {
  return Math.floor(Math.random() * (sides + 1));
}

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const sides = interaction.options.getInteger("sides");
  if (!sides) {
    throw new Error("Invalid sides");
  }
  await interaction.reply(`Your d${sides} roll: ${rollDie(sides)}`);
}

export const roll: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a die")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("The number of sides on the die")
        .setRequired(true)
        .addChoices(
          { name: "4", value: 4 },
          { name: "6", value: 6 },
          { name: "8", value: 8 },
          { name: "10", value: 10 },
          { name: "12", value: 12 },
          { name: "20", value: 20 },
        ),
    ),
  execute,
};
