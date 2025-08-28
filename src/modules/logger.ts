import pino, { type Logger } from "pino";
import { ENV } from "varlock/env";

let logger: Logger;

export function getLogger(): Logger {
  if (!logger) {
    logger = pino({
      level: ENV.LOG_LEVEL,
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          ignore: "pid,hostname",
          translateTime: "yyyy-mm-dd hh:MM:ss TT",
          levelFirst: true,
          minimumLevel: ENV.LOG_LEVEL,
        },
      },
    });
  }

  return logger;
}
