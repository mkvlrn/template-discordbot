import {
  type ChatInputCommandInteraction,
  MessageFlags,
  type MessageFlagsBitField,
  SlashCommandBuilder,
} from "discord.js";
import { createEmbedResult } from "#/commands/roll.helpers";
import type { BotCommand } from "#/core/commands";
import { rollDice } from "#/utils/dice";

const data = new SlashCommandBuilder()
  .setName("roll-plus")
  .setDescription("Roll a die using an expression")
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription("a dice roll expression (e.g., 2d6, 3d10) — add ! to hide from channel")
      .setRequired(true),
  );

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const expression = interaction.options.getString("expression", true).trim();
  const result = rollDice(expression.replace("!", ""));
  if (result.isError) {
    await interaction.reply(`${expression} is not a valid dice roll expression. Try again!`);
    return;
  }

  const [embeds, files] = createEmbedResult(interaction.user.id, result.value);
  const flags: ReturnType<typeof MessageFlagsBitField.resolve>[] = [];
  if (expression.endsWith("!")) {
    flags.push(MessageFlags.Ephemeral);
  }

  await interaction.reply({ embeds, files, flags });
}

export const rollPlus = {
  data,
  execute,
} satisfies BotCommand;
