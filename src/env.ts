import process from "node:process";
import { cleanEnv, str } from "envalid";

export const ENV = cleanEnv(process.env, {
  DISCORD_CLIENT_ID: str(),
  DISCORD_CLIENT_TOKEN: str(),
  LOG_LEVEL: str({
    choices: ["trace", "debug", "info", "warn", "error", "fatal"],
    default: "trace",
  }),
  DEV_SERVER: str(),
});
