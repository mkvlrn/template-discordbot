import { ENV } from "#modules/envs.ts";
import { pino, type Logger } from "pino";

let logger: Logger;

export function getLogger(): Logger {
  if (!logger) {
    logger = pino({
      level: ENV.logLevel as pino.Level,
      transport: {
        target: ENV.devMode ? "pino-pretty" : "@logtail/pino",
        options: ENV.devMode
          ? {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "yyyy-mm-dd hh:MM:ss TT",
            }
          : { sourceToken: ENV.logtailToken },
      },
    });
  }

  return logger;
}
