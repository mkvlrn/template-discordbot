import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

const diceFaces = [4, 6, 8, 10, 12, 20];

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export const roll: BotCommand = {
  register: true,
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Roll a die")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("The number of sides on the die")
        .setRequired(true)
        .addChoices(diceFaces.map((v) => ({ name: v.toString(), value: v }))),
    ),
  execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
    const sides = interaction.options.getInteger("sides");
    if (!sides) {
      throw new Error("Invalid sides");
    }
    await interaction.reply(`Your d${sides} roll: ${rollDie(sides)}`);
  },
};
