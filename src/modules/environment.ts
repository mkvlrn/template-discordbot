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
});

const { botToken, botClientId, devMode, serverId } = process.env;
const envFile = { botToken, botClientId, devMode, serverId };

const result = schema.safeParse(envFile);
if (!result.success) {
  throw new Error(
    `Invalid environment: ${result.error.errors.map((e) => e.message).join(", ")}`,
  );
}

export const ENV = result.data;
