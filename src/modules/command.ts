/** biome-ignore-all lint/correctness/noNodejsModules: needed */
import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";

export type Command = {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
};

let commands: Map<string, Command>;

export function createCommand(
  name: string,
  description: string,
  executable: Command["execute"],
): Command {
  return {
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: executable,
  };
}

const fileExtensionRegex = /.(t|j)s/;

export async function getCommands(): Promise<Map<string, Command>> {
  if (!commands) {
    commands = new Map<string, Command>();

    const modulesDir = dirname(fileURLToPath(import.meta.url));
    const commandsDir = join(modulesDir, "../commands");
    const files = await readdir(commandsDir);

    for (const file of files.filter((f) => !f.includes("map"))) {
      const commandName = file.replace(fileExtensionRegex, "");
      const commandPath = pathToFileURL(join(commandsDir, file));
      const commandModule = await import(commandPath.href);
      const command = commandModule[commandName] as Command;

      if (
        command &&
        command.data instanceof SlashCommandBuilder &&
        typeof command.execute === "function"
      ) {
        commands.set(command.data.name, command);
      }
    }
  }

  return commands;
}
