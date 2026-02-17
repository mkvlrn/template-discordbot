import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  MessageFlags,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import { createBotCommand, type FollowUpInteraction } from "#/core/commands";
import { diceFaces, rollDice } from "#/utils/dice";
import { generateDiceImage } from "#/utils/dice-img";

const data = new SlashCommandBuilder()
  .setName("roll-panel")
  .setDescription("Roll a dice using a panel");

function createDieButton(sides: number, quantity = 1): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(`roll-panel:${sides}:${quantity}`)
    .setLabel(`d${sides}`)
    .setStyle(ButtonStyle.Primary);
}

function createSelect(quantity = 1): StringSelectMenuBuilder {
  return new StringSelectMenuBuilder()
    .setCustomId("roll-panel:quantity")
    .setPlaceholder(`${quantity}`)
    .addOptions(
      Array.from({ length: 6 }, (_, i) => ({
        label: `${i + 1}`,
        value: `${i + 1}`,
        description: `Roll ${i + 1} ${i === 0 ? "die" : "dice"}`,
      })),
    );
}

function createComponents(quantity = 1) {
  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(createSelect(quantity)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      diceFaces.slice(0, 3).map((s) => createDieButton(s, quantity)),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      diceFaces.slice(3).map((s) => createDieButton(s, quantity)),
    ),
  ];
}

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply({
    content: "Roll!",
    components: createComponents(),
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
    await interaction.update({ content: "Roll", components: createComponents(quantity) });
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
    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setTitle(`🎲 ${quantity}d${sides}`)
      .setDescription(`<@${interaction.user.id}> rolled **${result.value.total}**`);
    const image = generateDiceImage(result.value);
    const attachment = image ? new AttachmentBuilder(image, { name: "dice.png" }) : null;
    if (attachment) {
      embed.setImage("attachment://dice.png");
    }
    await interaction.reply({
      embeds: [embed],
      files: attachment ? [attachment] : [],
    });
  }
}

createBotCommand({ data, execute, followUp });
