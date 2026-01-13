/** biome-ignore-all lint/suspicious/noConsole: user feedback */
import "varlock/auto-load";
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { ENV } from "varlock/env";
import { commands } from "#/modules/commands";

const scriptName = process.env["npm_lifecycle_event"];
if (!(scriptName && ["register", "unregister"].includes(scriptName))) {
  console.error(
    "invalid script name: must be 'register' or 'unregister' - don't call this directly, use the pnpm scripts instead",
  );
  process.exit(1);
}
const unregister = scriptName === "unregister";
const scope = process.argv.at(2) ?? "global";
if (scope !== "global" && !/^\d+$/.test(scope)) {
  console.error("invalid scope: must be a server ID or omit for global");
  process.exit(1);
}
const restClient = new REST().setToken(ENV.DISCORD_CLIENT_TOKEN);
let route = Routes.applicationCommands(ENV.DISCORD_CLIENT_ID);
let target = "globally";
if (scope !== "global") {
  try {
    const guild = (await restClient.get(Routes.guild(scope))) as Guild;
    target = `on server '${guild.name}' (${scope})`;
    route = Routes.applicationGuildCommands(ENV.DISCORD_CLIENT_ID, scope);
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}
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
