/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { getCommands } from "#/modules/command";
import { env } from "#/modules/env";
import { getLogger } from "#/modules/logger";

const logger = getLogger();

function getArgs(): { serverId: string; unregister: boolean } {
  let errorMessage = "Invalid arguments:\n";
  errorMessage += " Expected: '<serverId>' or '<serverId> --unregister'.\n";
  errorMessage += " <serverId> must be a valid discord server id or 'global'";

  const args = process.argv.slice(2);
  if (args.length === 0 || args.length > 2) {
    logger.error(errorMessage);
    process.exit(1);
  }

  const serverId = args[0]?.trim();
  if (!serverId) {
    logger.error(errorMessage);
    process.exit(1);
  }

  const unregister = args.length === 2 && args[1] === "--unregister";
  if (args.length === 2 && !unregister) {
    logger.error(errorMessage);
    process.exit(1);
  }

  return { serverId, unregister };
}

async function getTarget(serverId: string, restClient: REST): Promise<string> {
  let target = "globally";
  if (serverId !== "global") {
    try {
      const guild = (await restClient.get(Routes.guild(serverId))) as Guild;
      target = `on server '${guild.name}' (${serverId})`;
    } catch (error) {
      logger.error((error as Error).message);
      process.exit(1);
    }
  }

  logger.info(`Updating commands ${target}`);

  return target;
}

async function registerCommands(): Promise<void> {
  const logger = getLogger();
  const commands = await getCommands();
  const { serverId, unregister } = getArgs();
  const restClient = new REST().setToken(env("botToken"));
  const target = await getTarget(serverId, restClient);

  const route =
    serverId === "global"
      ? Routes.applicationCommands(env("botClientId"))
      : Routes.applicationGuildCommands(env("botClientId"), serverId);
  const payload: RequestData = {
    body: unregister ? [] : Array.from(commands, ([_, command]) => command.data.toJSON()),
  };

  try {
    await restClient.put(route, payload);
    logger.info(
      `Commands ${unregister ? "un" : ""}registered ${target}: ${[...commands.keys()].join(", ")}`,
    );
  } catch (error) {
    logger.error((error as Error).message);
    throw error;
  }
}

await registerCommands();
