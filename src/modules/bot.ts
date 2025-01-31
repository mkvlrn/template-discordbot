import type { Command } from "#modules/command.ts";
import { logger } from "#modules/logger.ts";
import type { GuildChannel, Interaction, InteractionReplyOptions } from "discord.js";

export async function interact(interaction: Interaction, commands: Map<string, Command>) {
  if (!interaction.isCommand()) {
    return;
  }

  const command = commands.get(interaction.commandName);
  if (!command) {
    logger.error(`Unknown command ${interaction.commandName} received`);
    return;
  }

  try {
    const channel = interaction.channel as GuildChannel;
    logger.trace(
      `Received command /${interaction.commandName} from @${interaction.user.username} in #${channel.name}`,
    );
    await command.execute(interaction);
    logger.trace(
      `/${interaction.commandName} successfully executed by @${interaction.user.username} in #${channel.name}`,
    );
  } catch (error) {
    logger.error(error, "Command execution error");
    const reply: InteractionReplyOptions = {
      content: "There was an error while executing this command.",
      ephemeral: true,
    };
    await (interaction.replied || interaction.deferred
      ? interaction.followUp(reply)
      : interaction.reply(reply));
  }
}
