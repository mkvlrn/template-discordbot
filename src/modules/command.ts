import {
  type CommandInteraction,
  type RequestData,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";
// biome-ignore lint/correctness/noNodejsModules: cli script
import fs from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: cli script
import path from "node:path";
import { logger } from "~/modules/logger";

export type Action = (interaction: CommandInteraction) => Promise<void>;

export interface Command {
  data: SlashCommandBuilder;
  execute: Action;
}

export function createCommand(
  name: string,
  description: string,
  execute: Action,
): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute,
  };
}

export async function loadCommands(): Promise<Map<string, Command>> {
  const commands = new Map<string, Command>();

  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const commandsDir = path.resolve(currentDir, "../commands");
  const commandFiles = await fs.readdir(commandsDir);
  const promises = commandFiles.map(async (file) => {
    const filePath = path.join(commandsDir, file);
    const { command } = (await import(filePath)) as { command: Command };
    commands.set(command.data.name, command);
  });

  await Promise.all(promises);

  return commands;
}

export async function registerCommands(
  commands: Map<string, Command>,
  botToken: string,
  botClientId: string,
  serverId: string | undefined = undefined,
) {
  const payload: RequestData = {
    body: Array.from(commands, ([_, command]) => command.data.toJSON()),
  };
  const rest = new REST().setToken(botToken);
  const routes = serverId
    ? Routes.applicationGuildCommands(botClientId, serverId)
    : Routes.applicationCommands(botClientId);

  try {
    await rest.put(routes, payload);
    logger.info(
      `Commands registered to ${serverId ?? "all servers"}: ${[...commands.keys()].join(", ")}`,
    );
  } catch (error) {
    logger.error((error as Error).message);
    throw error;
  }
}
