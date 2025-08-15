/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

const MODULES_DIR = dirname(fileURLToPath(import.meta.url));
const COMMANDS_DIR = join(MODULES_DIR, "../commands");
const FILE_EXTENSION_REGEX = /.(t|j)s/;

let commands: Map<string, Command>;

function createCommand(name: string, description: string, executable: Command["execute"]): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: executable,
  };
}

async function loadCommandFromFile(file: string): Promise<Command | undefined> {
  const commandName = file.replace(FILE_EXTENSION_REGEX, "");
  const commandPath = pathToFileURL(join(COMMANDS_DIR, file));
  const commandModule = await import(commandPath.href);
  const command = commandModule[commandName] as Command;

  if (
    command &&
    command.data instanceof SlashCommandBuilder &&
    typeof command.execute === "function"
  ) {
    return command as Command;
  }

  return undefined;
}

async function getCommands(): Promise<Map<string, Command>> {
  if (!commands) {
    commands = new Map<string, Command>();

    const files = await readdir(COMMANDS_DIR);
    const importPromises = files.filter((f) => !f.includes("map")).map(loadCommandFromFile);
    const importedCommands = await Promise.all(importPromises);

    for (const command of importedCommands) {
      if (command) {
        commands.set(command.data.name, command);
      }
    }
  }

  return commands;
}

export { type Command, createCommand, getCommands };
