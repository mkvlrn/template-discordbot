import { type Logger, pino } from "pino";

export function createLogger(isDevelopment: boolean): Logger {
  if (!isDevelopment) {
    return pino({
      level: "error",
      transport: {
        target: "pino/file",
        options: {
          destination: "./logs/error.log",
        },
      },
    });
  }

  return pino({
    level: "trace",
    transport: {
      target: "pino-pretty",
      options: {
        colorize: true,
        ignore: "pid,hostname",
        translateTime: "yyyy-mm-dd hh:MM:ss TT",
      },
    },
  });
}
