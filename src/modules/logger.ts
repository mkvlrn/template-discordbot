import "varlock/auto-load";
import { pino } from "pino";
import { ENV } from "varlock/env";

export const logger = pino({ level: ENV.LOG_LEVEL });
