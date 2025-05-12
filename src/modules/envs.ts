// biome-ignore-start lint/correctness/noNodejsModules: hella needed here
import process from "node:process";
// biome-ignore-end lint/correctness/noNodejsModules: yeah
import { z } from "zod";

// biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
const schema = z.object({
  botToken: z.string({ message: "Bot token (botToken) is required" }),
  botClientId: z.string({
    message: "Bot client ID (botClientId) is required",
  }),
  devMode: z
    .enum(["true", "false"], {
      message: "Dev mode (devMode) must be either true or false",
    })
    // biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
    .transform((v) => v === "true"),
  logtailToken: z.string({}).optional(),
  logLevel: z.enum(["trace", "debug", "info", "warn", "error", "fatal", "silent"]).optional(),
});

// biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
const envFile = {
  botToken: process.env.botToken,
  botClientId: process.env.botClientId,
  devMode: process.env.devMode,
  logtailToken: process.env.logtailToken,
  logLevel: process.env.logLevel,
};

// biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
const result = schema.safeParse(envFile);
if (!result.success) {
  // biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
  throw new Error(`Invalid environment: ${result.error.errors.map((e) => e.message).join(", ")}`);
}

// biome-ignore lint/nursery/useExplicitType: https://github.com/biomejs/biome/issues/5932
export const ENV = result.data;
