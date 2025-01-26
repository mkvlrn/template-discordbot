import { Client, Events, GatewayIntentBits } from "discord.js";
import { ping } from "~/commands/ping";
import { interact } from "~/modules/bot";
import type { Command } from "~/modules/command";
import { ENV } from "~/modules/environment";
import { logger } from "~/modules/logger";

const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = new Map<string, Command>();
commands.set(ping.data.name, ping);

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
