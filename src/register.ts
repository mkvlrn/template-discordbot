import { REST, Routes, type Guild, type RequestData } from "discord.js";
import { commands } from "~/commands/_commands";
import { ENV } from "~/modules/environment";
import { logger } from "~/modules/logger";

const errorMessage = "Invalid arguments. Expected: 'register <serverId>' or 'register global'";

// errors out if there's no args - must be exactly one
const args = process.argv.slice(2);
if (args.length !== 1 || args[0] === undefined) {
  logger.error(errorMessage);
  process.exit(1);
}

// errors out if the arg is not "global" or is an empty string
const serverId = args[0].trim();
if (serverId !== "global" && serverId === "") {
  logger.error(errorMessage);
  process.exit(1);
}

const restClient = new REST().setToken(ENV.botToken);
let target = "globally";
if (serverId !== "global") {
  try {
    const guild = (await restClient.get(Routes.guild(serverId))) as Guild;
    target = `server '${guild.name}' (${serverId})`;
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}

logger.info(`Registering commands ${target}`);

const payload: RequestData = {
  body: Array.from(commands, ([_, command]) => command.data.toJSON()),
};

const route =
  serverId === "global"
    ? Routes.applicationCommands(ENV.botClientId)
    : Routes.applicationGuildCommands(ENV.botClientId, serverId);

try {
  await restClient.put(route, payload);
  logger.info(`Commands registered ${target}: ${[...commands.keys()].join(", ")}`);
} catch (error) {
  logger.error((error as Error).message);
  throw error;
}
