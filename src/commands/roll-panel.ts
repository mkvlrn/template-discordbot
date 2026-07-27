import { type ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { createEmbedResult, createRollPanelComponents } from "#/commands/roll.helpers";
import type { BotCommand, FollowUpInteraction } from "#/core/commands";
import { rollDice } from "#/utils/dice";

const data = new SlashCommandBuilder()
  .setName("roll-panel")
  .setDescription("Roll a dice using a panel");

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply({
    content: "Roll!",
    components: createRollPanelComponents(),
    flags: [MessageFlags.Ephemeral],
  });
}

async function followUp(interaction: FollowUpInteraction): Promise<void> {
  // quantity changed
  if (interaction.isStringSelectMenu()) {
    const quantity = Number(interaction.values[0]);
    if (!quantity) {
      await interaction.reply({ content: "Invalid quantity", flags: [MessageFlags.Ephemeral] });
      return;
    }
    await interaction.update({ content: "Roll", components: createRollPanelComponents(quantity) });
    return;
  }

  // die button clicked
  if (interaction.isButton()) {
    const [, sidesStr, quantityStr] = interaction.customId.split(":");
    const sides = Number(sidesStr);
    const quantity = Number(quantityStr);
    if (!(sides && quantity)) {
      await interaction.reply({ content: "Invalid expression", flags: [MessageFlags.Ephemeral] });
      return;
    }

    const result = rollDice(`${quantity}d${sides}`);
    if (result.isError) {
      await interaction.reply({ content: "Invalid expression", flags: [MessageFlags.Ephemeral] });
      return;
    }

    const [embeds, files] = createEmbedResult(interaction.user.id, result.value);

    await interaction.reply({ embeds, files });
  }
}

export const rollPanel = {
  data,
  execute,
  followUp,
} satisfies BotCommand;
