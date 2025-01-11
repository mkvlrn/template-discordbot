import { Client, Events, GatewayIntentBits } from "discord.js";
import { interact } from "~/modules/bot";
import { loadCommands } from "~/modules/command";
import { ENV } from "~/modules/environment";
import { logger } from "~/modules/logger";

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = await loadCommands();

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
