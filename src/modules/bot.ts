import {
  Client,
  Events,
  GatewayIntentBits,
  type GuildChannel,
  type Interaction,
  type InteractionReplyOptions,
} from "discord.js";
import { type Command, getCommands } from "#/modules/command";
import { getLogger } from "#/modules/logger";

let bot: Client | undefined;
const logger = getLogger();

async function interact(interaction: Interaction, commands: Map<string, Command>): Promise<void> {
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
    const channel = interaction.channel as GuildChannel;
    logger.trace(
      `Received /${interaction.commandName} from @${interaction.user.username} in ${server?.name}#${channel.name}`,
    );
    await command.execute(interaction);
    logger.trace(
      `/${interaction.commandName} executed by @${interaction.user.username} in ${server?.name}#${channel.name}`,
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

export async function getBot(): Promise<Client> {
  let commands: Map<string, Command>;

  if (!bot) {
    bot = new Client({ intents: [GatewayIntentBits.Guilds] });
    commands = await getCommands();

    bot.once(Events.ClientReady, (c) => {
      logger.info(`Logged in as ${c.user.displayName}`);
    });

    bot.on(Events.InteractionCreate, async (interaction) => {
      await interact(interaction, commands);
    });

    bot.on(Events.Error, (error) => {
      logger.error(error, "Bot error");
    });
  }

  return bot;
}
