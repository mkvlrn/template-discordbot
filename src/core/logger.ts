import { pino } from "pino";
import { ENV } from "#env";

export const logger = pino({ level: ENV.LOG_LEVEL });
