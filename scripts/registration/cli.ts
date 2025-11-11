import { Command } from "commander";

interface Options {
  global: boolean;
  server: string;
}

type Handler = (
  action: "add" | "remove",
) => (opts: Options, registration: Command) => Promise<void>;

const registration = new Command()
  .name("registration")
  .description("add or remove bot commands")
  .usage("[command]")
  .helpCommand(true)
  .helpOption(false)
  .action(() => {
    return;
  });

function setupCli(commandHandler: Handler): Command {
  registration
    .command("add")
    .description("add bot commands globally or to a specified server")
    .option("-g, --global", "add commands globally - exclusive with --server option")
    .option(
      "-s, --server <serverId>",
      "add commands to server with id <serverId> - exclusive with --global option",
    )
    .helpOption(false)
    .action(commandHandler("add"));

  registration
    .command("remove")
    .description("remove bot commands globally or to a specified server")
    .option("-g, --global", "remove commands globally - exclusive with --server option")
    .option(
      "-s, --server <serverId>",
      "remove commands from server with id <serverId> - exclusive with --global option",
    )
    .helpOption(false)
    .action(commandHandler("remove"));

  return registration;
}

export { type Options, setupCli };
