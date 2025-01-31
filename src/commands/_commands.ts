import { ping } from "#commands/ping.ts";
import type { Command } from "#modules/command.ts";

const commands = new Map<string, Command>();
commands.set(ping.data.name, ping);

export { commands };
