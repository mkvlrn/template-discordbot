import type { ChatInputCommandInteraction, Interaction, InteractionReplyOptions } from "discord.js";
import type { BotCommand, FollowUpInteraction } from "#core/commands";
import { logger } from "#core/logger";

function buildAttribution(interaction: Interaction): string {
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
  return `@${interaction.user.username} in ${server?.name ?? "DM"}#${channelName}`;
}

async function sendErrorResponse(interaction: ChatInputCommandInteraction): Promise<void> {
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

async function executeCommand(
  interaction: ChatInputCommandInteraction,
  command: BotCommand,
): Promise<void> {
  const attribution = buildAttribution(interaction);
  try {
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
    await sendErrorResponse(interaction);
  }
}

async function executeFollowUp(
  interaction: FollowUpInteraction,
  command: BotCommand,
): Promise<void> {
  const attribution = buildAttribution(interaction);
  try {
    await command.followUp?.(interaction);
    logger.trace(`/${interaction.customId} executed by ${attribution}`);
  } catch (error) {
    logger.error(
      {
        error,
        commandName: interaction.customId,
        userId: interaction.user.id,
        guildId: interaction.guild?.id,
      },
      "FollowUp interaction execution error",
    );
  }
}

function getCommandName(interaction: Interaction): string {
  if (interaction.isChatInputCommand()) {
    return interaction.commandName;
  }
  if (interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit()) {
    const customId = interaction.customId.split(":")[0];
    if (!customId) {
      throw new Error("Custom ID is not valid");
    }
    return customId;
  }
  throw new Error(`Unexpected interaction type: ${interaction.constructor.name}`);
}

function isFollowUpInteraction(interaction: Interaction): interaction is FollowUpInteraction {
  return interaction.isButton() || interaction.isAnySelectMenu() || interaction.isModalSubmit();
}

export async function interact(
  interaction: Interaction,
  commands: Map<string, BotCommand>,
): Promise<void> {
  const command = commands.get(getCommandName(interaction));
  if (!command) {
    logger.error("Unknown command received");
    return;
  }
  if (interaction.isChatInputCommand()) {
    await executeCommand(interaction, command);
  } else if (isFollowUpInteraction(interaction)) {
    await executeFollowUp(interaction, command);
  }
}
