// biome-ignore lint/correctness/noNodejsModules: cli script
import fs from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: cli script
import path from "node:path";
// biome-ignore lint/correctness/noNodejsModules: cli script
import url from "node:url";
import type { Logger } from "pino";
import { type Command, createCommand } from "~/utils/create-command.js";

export async function loadCommands(logger: Logger) {
  const commands = new Map<string, Command>();

  const currentFilePath = url.fileURLToPath(import.meta.url);
  const currentDirectoryPath = path.dirname(currentFilePath);
  const commandsDirectoryPath = path.resolve(currentDirectoryPath, "../commands");
  const commandFiles = await fs.readdir(commandsDirectoryPath);
  const promises = commandFiles.map(async (file) => {
    const filePath = path.join(commandsDirectoryPath, file);
    const { name, description, execute } = await import(filePath);
    const command = createCommand(name, description, execute);
    commands.set(name, command);
  });

  await Promise.all(promises);
  logger.info(`Loaded commands: ${[...commands.keys()].join(", ")}`);

  return commands;
}
