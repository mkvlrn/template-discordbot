/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import "varlock/auto-load";
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { ENV } from "varlock/env";
import { getCommands } from "#/modules/command";
import { getLogger } from "#/modules/logger";

const logger = getLogger();
const restClient = new REST().setToken(ENV.DISCORD_CLIENT_TOKEN);
let target = "globally";
let route = Routes.applicationCommands(ENV.DISCORD_CLIENT_ID);

// parsing options
const options = process.argv.slice(2);
const validOptions = ["--global", "--unregister"];
const invalidOptions = options.filter((arg) => !validOptions.includes(arg));
if (invalidOptions.length > 0) {
  logger.error("Usage: pnpm register-commands [--global] [--unregister]");
  process.exit(1);
}
const isGlobal = options.includes("--global");
const unregister = options.includes("--unregister");
const commands = await getCommands();

// settings for targeted register
if (!isGlobal) {
  if (!ENV.SERVER_ID) {
    logger.error(
      "Please set the SERVER_ID environment variable if not registering commands globally.",
    );
    process.exit(1);
  }

  try {
    const guild = (await restClient.get(Routes.guild(ENV.SERVER_ID))) as Guild;
    target = `on server '${guild.name}' (${ENV.SERVER_ID})`;
    route = Routes.applicationGuildCommands(ENV.DISCORD_CLIENT_ID, ENV.SERVER_ID);
  } catch (error) {
    logger.error((error as Error).message);
    process.exit(1);
  }
}

// do stuff
logger.info(`Updating commands ${target}`);
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
  process.exit(1);
}
