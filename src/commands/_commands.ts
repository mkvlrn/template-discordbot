import { ping } from "~/commands/ping";
import type { Command } from "~/modules/command";

const commands = new Map<string, Command>();
commands.set(ping.data.name, ping);

export { commands };
