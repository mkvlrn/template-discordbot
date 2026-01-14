import {
  AttachmentBuilder,
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import type { BotCommand } from "#/modules/commands";
import { rollFromExpression } from "#/utils/dice";
import { generateDiceImage } from "#/utils/dice-img";

const data = new SlashCommandBuilder()
  .setName("rollplus")
  .setDescription("Roll a die using an expression")
  .addStringOption((option) =>
    option
      .setName("expression")
      .setDescription("a dice roll expression, such as 2d6 or 3d10")
      .setRequired(true),
  );

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const expression = interaction.options.getString("expression", true);
  const result = rollFromExpression(expression);
  if (!result) {
    await interaction.reply(`${expression} is not a valid dice roll expression. Try again!`);
    return;
  }
  const embed = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle(`🎲 ${result.quantity}d${result.die}`)
    .setDescription(`<@${interaction.user.id}> rolled **${result.total}**`);
  const image = generateDiceImage(result.values, result.total);
  const attachment = image ? new AttachmentBuilder(image, { name: "dice.png" }) : null;
  if (attachment) {
    embed.setImage("attachment://dice.png");
  }
  await interaction.reply({
    embeds: [embed],
    files: attachment ? [attachment] : [],
  });
}

export const rollplus = { data, execute } satisfies BotCommand;
