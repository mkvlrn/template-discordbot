import { pino, type LoggerOptions } from "pino";
import { ENV } from "~/modules/environment";

const { devMode } = ENV;

const transport: LoggerOptions["transport"] = {
  target: devMode ? "pino-pretty" : "@logtail/pino",
  options: devMode
    ? {
        colorize: devMode,
        ignore: devMode ? "pid,hostname" : "",
        translateTime: "yyyy-mm-dd hh:MM:ss TT",
        destination: devMode ? "" : "./logs/error.log",
      }
    : {},
};

export const logger = pino({
  level: devMode ? "trace" : "error",
  transport,
});
