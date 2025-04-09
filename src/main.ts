import { getBot } from "#modules/bot";
import { ENV } from "#modules/envs";

const bot = await getBot();

await bot.client.login(ENV.botToken);
