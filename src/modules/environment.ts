import { z } from "zod";

const schema = z.object({
  botToken: z.string({ message: "Bot token (botToken) is required" }),
  botClientId: z.string({
    message: "Bot client ID (botClientId) is required",
  }),
  devMode: z
    .enum(["true", "false"], {
      message: "Dev mode (devMode) must be either true or false",
    })
    .transform((v) => v === "true"),
  logtailToken: z.string({}).optional(),
  logLevel: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).optional(),
});

const { botToken, botClientId, devMode, logtailToken, logLevel } = process.env;
const envFile = { botToken, botClientId, devMode, logtailToken, logLevel };

const result = schema.safeParse(envFile);
if (!result.success) {
  throw new Error(`Invalid environment: ${result.error.errors.map((e) => e.message).join(", ")}`);
}

export const ENV = result.data;
