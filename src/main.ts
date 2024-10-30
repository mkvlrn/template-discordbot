import {
  Client,
  Events,
  GatewayIntentBits,
  type GuildChannel,
  type InteractionReplyOptions,
} from "discord.js";
import { createLogger } from "~/utils/create-logger";
import { loadCommands } from "~/utils/load-commands";
import { loadEnvironment } from "~/utils/load-environment";
import { registerCommands } from "~/utils/register-commands";

const { botToken, botClientId, serverId, devMode } = loadEnvironment();

const logger = createLogger(devMode);
const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = await loadCommands(logger);
await registerCommands(logger, commands, botToken, botClientId, serverId);

bot.once(Events.ClientReady, (client) => {
  logger.info(`Logged in as ${client.user.displayName}`);
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

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
      `/${interaction.commandName} executed by @${interaction.user.username} in #${channel.name}`,
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
});

bot.on(Events.Error, (error) => {
  logger.error(error, "Bot error");
});

await bot.login(botToken);
