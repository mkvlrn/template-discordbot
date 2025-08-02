import { getBot } from "#/modules/bot";
import { env } from "#/modules/env";

env();

const bot = await getBot();
await bot.client.login(env("botToken"));
