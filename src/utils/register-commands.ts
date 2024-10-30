import { type RequestData, REST, Routes } from "discord.js";
import type { Logger } from "pino";
import type { Command } from "~/utils/create-command";

export async function registerCommands(
  logger: Logger,
  commands: Map<string, Command>,
  botToken: string,
  botClientId: string,
  serverId: string,
): Promise<void> {
  const payload: RequestData = {
    body: Array.from(commands, ([_, command]) => command.data.toJSON()),
  };
  const rest = new REST().setToken(botToken);

  try {
    await rest.put(Routes.applicationGuildCommands(botClientId, serverId), payload);
    logger.info("Registered commands to server");
  } catch (error) {
    logger.error((error as Error).message);
    throw error;
  }
}
