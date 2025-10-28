import process from "node:process";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { type Command, getCommands } from "#/modules/command";
import { interact } from "#/modules/interaction";
import { getLogger } from "#/modules/logger";

let bot: Client | null = null;
let commands: Map<string, Command>;
const logger = getLogger();

async function getBot(): Promise<Client> {
  if (!commands) {
    commands = await getCommands();
  }

  if (!bot) {
    bot = new Client({ intents: [GatewayIntentBits.Guilds] });

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

export async function startBot(token: string) {
  const bot = await getBot();
  try {
    await bot.login(token);
  } catch (error) {
    logger.fatal({ error }, "failed to login");
    process.exit(1);
  }

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      logger.info(`Received ${signal}, shutting down`);
      bot.destroy();
      process.exit(0);
    });
  }
}
