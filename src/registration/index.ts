import "varlock/auto-load";
import { handleOptions } from "#/registration/cli";
import { handleRegistration } from "#/registration/handler";

const cli = handleOptions();
await handleRegistration(cli);
