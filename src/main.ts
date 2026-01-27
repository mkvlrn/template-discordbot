import { startBot } from "#core/bot";
import { ENV } from "#env";

await startBot(ENV.DISCORD_CLIENT_TOKEN);
