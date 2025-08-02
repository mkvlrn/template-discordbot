import { type Logger, pino } from "pino";
import { env } from "#/modules/env";

let logger: Logger;

export function getLogger(): Logger {
  if (!logger) {
    logger = pino({
      level: env("logLevel") as pino.Level,
      transport: {
        target: env("devMode") ? "pino-pretty" : "@logtail/pino",
        options: env("devMode")
          ? {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "yyyy-mm-dd hh:MM:ss TT",
              levelFirst: true,
              minimumLevel: "trace",
            }
          : { sourceToken: env("logtailToken") },
      },
    });
  }

  return logger;
}
