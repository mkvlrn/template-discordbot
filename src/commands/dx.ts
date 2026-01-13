import {
  ActionRowBuilder,
  type AnySelectMenuInteraction,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  type ChatInputCommandInteraction,
  MessageFlags,
  type ModalSubmitInteraction,
  SlashCommandBuilder,
} from "discord.js";
import type { BotCommand } from "#/modules/commands";

const diceFaces = [4, 6, 8, 10, 12, 20];

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

const data = new SlashCommandBuilder().setName("dx").setDescription("Roll a dx");

function createDieButton(sides: number): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(`dx:${sides}`)
    .setLabel(`d${sides}`)
    .setStyle(ButtonStyle.Primary);
}

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  const rows = [
    new ActionRowBuilder<ButtonBuilder>().addComponents(diceFaces.slice(0, 3).map(createDieButton)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(diceFaces.slice(3).map(createDieButton)),
  ];
  await interaction.reply({
    content: "Roll!",
    components: [...rows],
    flags: [MessageFlags.Ephemeral],
  });
}

async function followUp(
  interaction: ButtonInteraction | AnySelectMenuInteraction | ModalSubmitInteraction,
): Promise<void> {
  const sides = Number(interaction.customId.split(":")[1]);
  if (!sides) {
    throw new Error("Invalid sides");
  }
  await interaction.reply({
    content: `<@${interaction.user.id}> Your d${sides} roll: ${rollDie(sides)}`,
  });
}

export const dx: BotCommand = {
  data,
  execute,
  followUp,
};
