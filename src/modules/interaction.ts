import type { Interaction, InteractionReplyOptions } from "discord.js";
import type { BotCommand } from "#/commands";
import { getLogger } from "#/modules/logger";

const logger = getLogger();

export async function interact(
  interaction: Interaction,
  commands: Map<string, BotCommand>,
): Promise<void> {
  if (!interaction.isCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.error(`Unknown command ${interaction.commandName} received`);
    return;
  }

  try {
    const server = interaction.guild;
    const channel = interaction.channel;
    const channelName = channel ? ("name" in channel ? channel.name : "DM") : "unknown";
    const attribution = `@${interaction.user.username} in ${server?.name ?? "DM"}#${channelName}`;

    logger.trace(`Received /${interaction.commandName} from ${attribution}`);
    await command.execute(interaction);
    logger.trace(`/${interaction.commandName} executed by ${attribution}`);
  } catch (error) {
    logger.error(
      {
        error,
        commandName: interaction.commandName,
        userId: interaction.user.id,
        guildId: interaction.guild?.id,
      },
      "Command execution error",
    );
    const reply: InteractionReplyOptions = {
      content: "There was an error while executing this command.",
      ephemeral: true,
    };
    await (interaction.replied || interaction.deferred
      ? interaction.followUp(reply)
      : interaction.reply(reply));
  }
}
