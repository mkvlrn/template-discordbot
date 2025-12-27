import type { Interaction, InteractionReplyOptions } from "discord.js";
import type { BotCommand } from "#commands/index";
import { getLogger } from "#modules/logger";

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
    let channelName: string;
    if (channel) {
      if ("name" in channel && typeof channel.name === "string") {
        channelName = channel.name;
      } else {
        channelName = "DM";
      }
    } else {
      channelName = "unknown";
    }
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
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
}
