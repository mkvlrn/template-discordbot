import { pino } from "pino";
import { ENV } from "~/modules/environment";

const { devMode } = ENV;

export const logger = pino({
  level: devMode ? "trace" : "error",
  transport: {
    target: devMode ? "pino-pretty" : "pino/file",
    options: {
      colorize: devMode,
      ignore: devMode ? "pid,hostname" : "",
      translateTime: "yyyy-mm-dd hh:MM:ss TT",
      destination: devMode ? "" : "./logs/error.log",
    },
  },
});
