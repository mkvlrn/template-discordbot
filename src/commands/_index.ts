import type { Command } from "#modules/command";

let commands: Map<string, Command>;

export async function getCommands(): Promise<Map<string, Command>> {
  if (!commands) {
    commands = new Map<string, Command>();

    const { ping } = await import("#commands/ping");
    commands.set(ping.data.name, ping);
  }

  return commands;
}
