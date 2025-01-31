import { commands } from "#commands/_commands.ts";
import { interact } from "#modules/bot.ts";
import { ENV } from "#modules/environment.ts";
import { logger } from "#modules/logger.ts";
import { Client, Events, GatewayIntentBits } from "discord.js";

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });

bot.once(Events.ClientReady, (client) => {
  logger.info(`Logged in as ${client.user.displayName}`);
});

bot.on(Events.InteractionCreate, async (interaction) => {
  await interact(interaction, commands);
});

bot.on(Events.Error, (error) => {
  logger.error(error, "Bot error");
});

await bot.login(ENV.botToken);
