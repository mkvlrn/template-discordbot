import "varlock/auto-load";
import { ENV } from "varlock/env";
import { startBot } from "#/modules/bot";

await startBot(ENV.DISCORD_CLIENT_TOKEN);
