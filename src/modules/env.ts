// biome-ignore lint/correctness/noNodejsModules: envs gotta env
import process from "node:process";
import { setupEnv } from "@mkvlrn/env";
import { z } from "zod";

const schema = z.object({
  botToken: z.string({ message: "Bot token (botToken) is required" }),
  botClientId: z.string({ message: "Bot client ID (botClientId) is required" }),
  devMode: z
    .enum(["true", "false"], {
      message: "Dev mode (devMode) must be either true or false",
    })
    .transform((v) => v === "true"),
  logtailToken: z.string().optional(),
  logLevel: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).optional(),
});

export const env = setupEnv(process.env, schema);
