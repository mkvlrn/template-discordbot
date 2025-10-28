/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getLogger } from "#/modules/logger";

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

const logger = getLogger();
const MODULES_DIR = dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = join(MODULES_DIR, "../commands");
const FILE_EXTENSION_REGEX = /.(t|j)s/;

function createCommand(name: string, description: string, executable: Command["execute"]): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: executable,
  };
}

async function loadCommandFromFile(file: string): Promise<Command | undefined> {
  const commandName = file.replace(FILE_EXTENSION_REGEX, "");
  const commandPath = pathToFileURL(join(COMMANDS_DIR, file));

  try {
    const commandModule = await import(commandPath.href);
    const command = commandModule[commandName] as Command;

    if (!command) {
      logger.warn(`No export named '${commandName}' found in ${file}`);
      return undefined;
    }

    if (!(command.data instanceof SlashCommandBuilder)) {
      logger.warn(`Command '${commandName}' has invalid data property`);
      return undefined;
    }

    if (typeof command.execute !== "function") {
      logger.warn(`Command '${commandName}' has invalid execute property`);
      return undefined;
    }

    return command;
  } catch (error) {
    logger.error({ error }, `Failed to load command ${file}`);
    return undefined;
  }
}

async function getCommands(): Promise<Map<string, Command>> {
  const commands = new Map<string, Command>();

  const files = await readdir(COMMANDS_DIR);
  const commandFiles = files.filter(
    (f) => (f.endsWith(".ts") || f.endsWith(".js")) && !f.includes(".map"),
  );
  const importPromises = commandFiles.map(loadCommandFromFile);
  const importedCommands = await Promise.all(importPromises);

  for (const command of importedCommands) {
    if (command) {
      commands.set(command.data.name, command);
    }
  }

  return commands;
}

export { type Command, createCommand, getCommands };
