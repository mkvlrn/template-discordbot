import {
  ActionRowBuilder,
  type APIEmbed,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  EmbedBuilder,
  type JSONEncodable,
  StringSelectMenuBuilder,
} from "discord.js";
import { diceFaces, maxDiceQuantity, type RollResult } from "#/utils/dice";
import { generateDiceImage } from "#/utils/dice-img";

const diceFacesPerRow = 3;

export function createEmbedResult(
  userId: string,
  result: RollResult,
): [(APIEmbed | JSONEncodable<APIEmbed>)[], AttachmentBuilder[]] {
  const embed = new EmbedBuilder()
    .setColor(Colors.Blurple)
    .setTitle(`🎲 ${result.quantity}d${result.die}`)
    .setDescription(`<@${userId}> rolled **${result.total}**`);

  const image = generateDiceImage(result);
  const files: AttachmentBuilder[] = [];
  if (image) {
    files.push(new AttachmentBuilder(image, { name: "dice.png" }));
    embed.setImage("attachment://dice.png");
  }

  return [[embed], files];
}

export function createRollPanelDieButton(sides: number, quantity = 1): ButtonBuilder {
  return new ButtonBuilder()
    .setCustomId(`roll-panel:${sides}:${quantity}`)
    .setLabel(`d${sides}`)
    .setStyle(ButtonStyle.Primary);
}

export function createRollPanelSelect(quantity = 1): StringSelectMenuBuilder {
  return new StringSelectMenuBuilder()
    .setCustomId("roll-panel:quantity")
    .setPlaceholder(`${quantity}`)
    .addOptions(
      Array.from({ length: maxDiceQuantity }, (_, i) => {
        const optionQuantity = i + 1;
        let dieName = "dice";
        if (optionQuantity === 1) {
          dieName = "die";
        }

        return {
          label: `${optionQuantity}`,
          value: `${optionQuantity}`,
          description: `Roll ${optionQuantity} ${dieName}`,
        };
      }),
    );
}

export function createRollPanelComponents(quantity = 1) {
  return [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(createRollPanelSelect(quantity)),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      diceFaces.slice(0, diceFacesPerRow).map((s) => createRollPanelDieButton(s, quantity)),
    ),
    new ActionRowBuilder<ButtonBuilder>().addComponents(
      diceFaces.slice(diceFacesPerRow).map((s) => createRollPanelDieButton(s, quantity)),
    ),
  ];
}
