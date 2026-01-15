import { type ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createBotCommand } from "#/modules/commands";
import { diceFaces, rollDice } from "#/utils/dice";

const data = new SlashCommandBuilder()
  .setName("roll")
  .setDescription("Roll a die")
  .addIntegerOption((option) =>
    option
      .setName("sides")
      .setDescription("The number of sides on the die")
      .setRequired(true)
      .addChoices(diceFaces.map((v) => ({ name: v.toString(), value: v }))),
  );

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const sides = interaction.options.getInteger("sides");
  if (!sides) {
    await interaction.reply("Invalid sides");
    return;
  }
  const result = rollDice(`1d${sides}`);
  if (result.isError) {
    await interaction.reply("Invalid sides");
    return;
  }
  await interaction.reply(`Your d${sides} roll: ${result.value.total}`);
}

createBotCommand({ data, execute });
