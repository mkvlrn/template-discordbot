import { getBot } from "#modules/bot.ts";
import { ENV } from "#modules/envs.ts";

const bot = await getBot();

await bot.client.login(ENV.botToken);
