import { getCommands } from "#commands/_index.ts";
import type { Command } from "#modules/command.ts";
import { getLogger } from "#modules/logger.ts";
import {
  Client,
  Events,
  GatewayIntentBits,
  type GuildChannel,
  type Interaction,
  type InteractionReplyOptions,
} from "discord.js";

type Bot = {
  client: Client;
  commands: Map<string, Command>;
};

const logger = getLogger();
let client: Client;
let commands: Map<string, Command>;
let bot: Bot | undefined;

export async function getBot(): Promise<Bot> {
  if (!bot) {
    client = new Client({ intents: [GatewayIntentBits.Guilds] });
    commands = await getCommands();

    client.once(Events.ClientReady, (client) => {
      logger.info(`Logged in as ${client.user.displayName}`);
    });

    client.on(Events.InteractionCreate, async (interaction) => {
      await interact(interaction);
    });

    client.on(Events.Error, (error) => {
      logger.error(error, "Bot error");
    });

    bot = {
      client,
      commands,
    };
  }

  return bot;
}

async function interact(interaction: Interaction) {
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
