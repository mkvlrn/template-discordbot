import process from "node:process";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { ENV } from "varlock/env";
import { commands } from "#/commands/index";
import type { Cli } from "#/registration/cli";

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
