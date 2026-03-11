import { startBot } from "#/core/bot";
import { env } from "#/env";

await startBot(env.DISCORD_CLIENT_TOKEN);
