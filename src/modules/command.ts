import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
// biome-ignore lint/correctness/noNodejsModules: cli script
import fs from "node:fs/promises";
// biome-ignore lint/correctness/noNodejsModules: cli script
import path from "node:path";

export type Action = (interaction: CommandInteraction) => Promise<void>;

export interface Command {
  data: SlashCommandBuilder;
  execute: Action;
}

export function createCommand(name: string, description: string, execute: Action): Command {
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
