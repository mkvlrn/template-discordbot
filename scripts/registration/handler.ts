/** biome-ignore-all lint/suspicious/noConsole: cli */
import process from "node:process";
import type { Command } from "commander";
import { type Guild, REST, type RequestData, Routes } from "discord.js";
import { ENV } from "varlock/env";
import { getCommands } from "#/modules/command";
import type { Options } from "./cli";

function handleBadOptions(opts: Options, registration: Command) {
  if (!(opts.global || opts.server)) {
    registration.help();
  }
  if (opts.global && opts.server) {
    console.error("options --global and --server are mutually exclusive");
    process.exit(1);
  }
}

async function prepareRequest(opts: Options): Promise<[REST, `/${string}`, string]> {
  const restClient = new REST().setToken(ENV.DISCORD_CLIENT_TOKEN);
  let route = Routes.applicationCommands(ENV.DISCORD_CLIENT_ID);
  let target = "globally";

  if (opts.server) {
    try {
      const guild = (await restClient.get(Routes.guild(opts.server))) as Guild;
      target = `on server '${guild.name}' (${opts.server})`;
      route = Routes.applicationGuildCommands(ENV.DISCORD_CLIENT_ID, opts.server);
      console.log(target, route);
    } catch (error) {
      console.error((error as Error).message);
      process.exit(1);
    }
  }

  return [restClient, route, target];
}

export function handleRegistration(action: "add" | "remove") {
  const unregister = action === "remove";

  return async (opts: Options, registration: Command) => {
    handleBadOptions(opts, registration);
    const [restClient, route, target] = await prepareRequest(opts);
    const commands = await getCommands();

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
  };
}
