/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import type { Logger } from "pino";
import { getCommands } from "#/modules/command";
import { env } from "#/modules/env";
import { getLogger } from "#/modules/logger";

function getServerId(logger: Logger): string {
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

  return serverId;
}

async function getTarget(logger: Logger, serverId: string, restClient: REST): Promise<string> {
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

  logger.info(`Registering commands to ${target}`);

  return target;
}

async function registerCommands(): Promise<void> {
  const logger = getLogger();
  const commands = await getCommands();
  const serverId = getServerId(logger);
  const restClient = new REST().setToken(env("botToken"));
  const target = await getTarget(logger, serverId, restClient);

  const route =
    serverId === "global"
      ? Routes.applicationCommands(env("botClientId"))
      : Routes.applicationGuildCommands(env("botClientId"), serverId);
  const payload: RequestData = {
    body: Array.from(commands, ([_, command]) => command.data.toJSON()),
  };

  try {
    await restClient.put(route, payload);
    logger.info(`Commands registered ${target}: ${[...commands.keys()].join(", ")}`);
  } catch (error) {
    logger.error((error as Error).message);
    throw error;
  }
}

await registerCommands();
