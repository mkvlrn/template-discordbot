import { loadCommands, registerCommands } from "~/modules/command";
import { ENV } from "~/modules/environment";
import { logger } from "~/modules/logger";

const errorMessage =
  "Invalid arguments. Expected: register [serverId] or register global";
const commands = await loadCommands();
let serverId: string | undefined;

const args = process.argv.slice(2);
if (args.length !== 1) {
  logger.error(errorMessage);
  process.exit(1);
}

if (args[0] !== "global") {
  serverId = args[0];
  if (serverId?.trim() === "") {
    logger.error(errorMessage);
    process.exit(1);
  }
}

logger.info(`Registering commands to ${serverId ?? "all servers"}`);
await registerCommands(commands, ENV.botToken, ENV.botClientId, serverId);
