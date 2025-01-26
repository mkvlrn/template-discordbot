import { pino } from "pino";
import { ENV } from "~/modules/environment";

export const logger = pino({
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
