import { type Logger, pino } from "pino";
import { ENV } from "#/modules/envs.js";

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
              levelFirst: true,
              minimumLevel: "trace",
            }
          : { sourceToken: ENV.logtailToken },
      },
    });
  }

  return logger;
}
