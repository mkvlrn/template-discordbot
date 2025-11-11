import "varlock/auto-load";
import { setupCli } from "./registration/cli";
import { handleRegistration } from "./registration/handler";

const registration = setupCli(handleRegistration);
registration.parse();
