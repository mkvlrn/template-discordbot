import "varlock/auto-load";
import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { ENV } from "varlock/env";
import { commands } from "#/modules/commands";

interface Cli {
  action: "register" | "unregister";
  scope: string;
}

export function handleOptions(): Cli {
  const action = process.argv.at(2);
  const scope = process.argv.at(3);
  if (action === undefined || scope === undefined) {
    console.error("missing action or scope");
    process.exit(1);
  }
  if (!["register", "unregister"].includes(action)) {
    console.error("invalid action: must be 'register' or 'unregister'");
    process.exit(1);
  }
  // biome-ignore lint/performance/useTopLevelRegex: simple enough regex
  if (scope !== "global" && !/\d+/.test(scope)) {
    console.error("invalid scope: must be 'global' or a server ID");
    process.exit(1);
  }
  return {
    action: action as "register" | "unregister",
    scope,
  };
}

async function prepareRequest(cli: Cli): Promise<[REST, `/${string}`, string]> {
  const restClient = new REST().setToken(ENV.DISCORD_CLIENT_TOKEN);
  let route = Routes.applicationCommands(ENV.DISCORD_CLIENT_ID);
  let target = "globally";
  if (cli.scope !== "global") {
    try {
      const guild = (await restClient.get(Routes.guild(cli.scope))) as Guild;
      target = `on server '${guild.name}' (${cli.scope})`;
      route = Routes.applicationGuildCommands(ENV.DISCORD_CLIENT_ID, cli.scope);
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  }
  return [restClient, route, target];
}

export async function handleRegistration(cli: Cli) {
  const unregister = cli.action === "unregister";
  const [restClient, route, target] = await prepareRequest(cli);
  console.info(`Updating commands ${target}`);
  const payload: RequestData = {
    body: unregister ? [] : Array.from(commands, ([_, command]) => command.data.toJSON()),
  };
  try {
    await restClient.put(route, payload);
    console.info(
      `Commands ${unregister ? "remov" : "add"}ed ${target}: ${[...commands.keys()].join(", ")}`,
    );
  } catch (error) {
    console.error((error as Error).message);
    process.exit(1);
  }
}

const cli = handleOptions();
await handleRegistration(cli);
