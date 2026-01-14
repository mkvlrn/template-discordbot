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
import type { BotCommand, FollowUpInteraction } from "#/modules/commands";
import { diceFaces, rollFromExpression } from "#/utils/dice";
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
      throw new Error("Invalid dice quantity");
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
      throw new Error("Invalid customId");
    }
    const result = rollFromExpression(`${quantity}d${sides}`);
    if (!result) {
      throw new Error("Invalid expression");
    }
    const embed = new EmbedBuilder()
      .setColor(Colors.Blurple)
      .setTitle(`🎲 ${quantity}d${sides}`)
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
}

export const rollPanel = { data, execute, followUp } satisfies BotCommand;
