import "varlock/auto-load";
import { ENV } from "varlock/env";
import { getBot } from "./modules/bot.ts";

const bot = await getBot();
await bot.login(ENV.DISCORD_CLIENT_TOKEN);
