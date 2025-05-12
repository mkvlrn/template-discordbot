import {
  Client,
  Events,
  GatewayIntentBits,
  type GuildChannel,
  type Interaction,
  type InteractionReplyOptions,
} from "discord.js";
import type { Logger } from "pino";
import { getCommands } from "~/commands/_index.js";
import type { Command } from "~/modules/command.js";
import { getLogger } from "~/modules/logger.js";

type Bot = {
  client: Client;
  commands: Map<string, Command>;
};

let bot: Bot | undefined;

async function interact(
  interaction: Interaction,
  logger: Logger,
  commands: Map<string, Command>,
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

export async function getBot(): Promise<Bot> {
  const logger = getLogger();
  let client: Client;
  let commands: Map<string, Command>;

  if (!bot) {
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    commands = await getCommands();

    client.once(Events.ClientReady, (c) => {
      logger.info(`Logged in as ${c.user.displayName}`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      await interact(interaction, logger, commands);
    });

    client.on(Events.Error, (error) => {
      logger.error(error, "Bot error");
    });

    bot = {
      client: client,
      commands: commands,
    };
  }

  return bot;
}
