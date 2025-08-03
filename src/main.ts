import { getBot } from "#/modules/bot";
import { env } from "#/modules/env";

env();

const bot = await getBot();
await bot.login(env("botToken"));
