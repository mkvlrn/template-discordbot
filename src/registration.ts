/** biome-ignore-all lint/suspicious/noConsole: user feedback */
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { commands, loadCommands } from "#/core/commands";
import { env } from "#/env";

const unregister = process.argv.includes("--unregister");
const isDev = process.argv.includes("--dev");
let scope = "global";
if (isDev) {
  if (!env.DEV_SERVER) {
    console.error("--dev flag requires DEV_SERVER environment variable to be set");
    process.exit(1);
  }
  scope = env.DEV_SERVER;
}
const restClient = new REST().setToken(env.DISCORD_CLIENT_TOKEN);
let route = Routes.applicationCommands(env.DISCORD_CLIENT_ID);
let target = "globally";
if (scope !== "global") {
  try {
    const guild = (await restClient.get(Routes.guild(scope))) as Guild;
    target = `on server '${guild.name}' (${scope})`;
    route = Routes.applicationGuildCommands(env.DISCORD_CLIENT_ID, scope);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
await loadCommands();
const payload: RequestData = {
  body: unregister ? [] : [...commands.values()].map((command) => command.data.toJSON()),
};
try {
  await restClient.put(route, payload);
  const action = unregister ? "removed" : "registered";
  console.info(`Commands ${action} ${target}: ${[...commands].map(([key, _]) => key).join(", ")}`);
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}
