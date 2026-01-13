import process from "node:process";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "#/modules/commands";
import { interact } from "#/modules/interaction";
import { logger } from "#/modules/logger";

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
bot.once(Events.ClientReady, (c) => {
  logger.info(`Logged in as ${c.user.displayName}`);
});
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
  await interact(interaction, commands);
});
bot.on(Events.Error, (error) => {
  logger.error(error, "Bot error");
});

export async function startBot(token: string) {
  try {
    await bot.login(token);
    for (const signal of ["SIGINT", "SIGTERM"]) {
      process.on(signal, () => {
        logger.info(`Received ${signal}, shutting down`);
        bot.destroy();
        process.exit(0);
      });
    }
  } catch (error) {
    logger.fatal({ error }, "failed to login");
    process.exit(1);
  }
}
