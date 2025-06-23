import { getBot } from "#/modules/bot.js";
import { ENV } from "#/modules/envs.js";

async function main(): Promise<void> {
  const bot = await getBot();

  await bot.client.login(ENV.botToken);
}

await main();
