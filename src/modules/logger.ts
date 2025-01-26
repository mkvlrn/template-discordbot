import { pino, type LoggerOptions } from "pino";
import { ENV } from "~/modules/environment";

const transport: LoggerOptions["transport"] = {
  target: ENV.devMode ? "pino-pretty" : "@logtail/pino",
  options: ENV.devMode
    ? {
        colorize: ENV.devMode,
        ignore: ENV.devMode ? "pid,hostname" : "",
        translateTime: "yyyy-mm-dd hh:MM:ss TT",
        destination: ENV.devMode ? "" : "./logs/error.log",
      }
    : { sourceToken: ENV.logtrailToken },
};

export const logger = pino({
  level: ENV.devMode ? "trace" : "error",
  transport,
});
