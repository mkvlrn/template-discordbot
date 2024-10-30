export function loadEnvironment() {
  const { BOT_TOKEN, BOT_CLIENT_ID, SERVER_ID, DEV_MODE } = process.env;
  if (
    BOT_TOKEN === undefined ||
    DEV_MODE === undefined ||
    BOT_CLIENT_ID === undefined ||
    SERVER_ID === undefined
  ) {
    throw new Error("Missing required environment variables");
  }

  return {
    botToken: BOT_TOKEN,
    botClientId: BOT_CLIENT_ID,
    serverId: SERVER_ID,
    devMode: DEV_MODE === "true",
  };
}
