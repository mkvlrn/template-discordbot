import "varlock/auto-load";
import { type Logger, pino } from "pino";
import { ENV } from "varlock/env";

let logger: Logger | undefined;

export function getLogger(): Logger {
  if (!logger) {
    logger = pino({ level: ENV.LOG_LEVEL });
  }
  return logger;
}
