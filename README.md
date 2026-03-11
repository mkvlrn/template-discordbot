# template-discordbot

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library.

> [!NOTE]
> This template favors [pnpm](https://pnpm.io). All instructions assume pnpm. If you insist on npm or yarn, you're on your own.
>
> This template targets Node.js LTS (>=24).

Uses:

- [biome](https://github.com/biomejs/biome) for linting and formatting
- [commitlint](https://github.com/conventional-changelog/commitlint) for linting commit messages
- [husky](https://github.com/typicode/husky) for git hooks
- [lint-staged](https://github.com/lint-staged/lint-staged) for checks on commit
- [vitest](https://github.com/vitest-dev/vitest) for testing
- [tsx](https://github.com/privatenumber/tsx) for dev time typescript
- [envalid](https://github.com/af/envalid) for env validation and parsing
- [@mkvlrn/result](https://github.com/mkvlrn/tools/blob/main/packages/result/README.md) for error handling

Subpath imports (`#/`) are used instead of relative paths, mapped in both `package.json` and `tsconfig.json`.

## prerequisites

- variables `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_TOKEN`, and `LOG_LEVEL` filled in `.env` file
- optionally, `DEV_SERVER` with your test server ID for faster command registration during development
- a notion of what a discord bot is and how `discord.js` works
- a server to test the bot on

## running

### `pnpm dev`

Runs the project in watch mode.

### `pnpm build`

Builds/transpiles the code to `./build`.

### `pnpm start`

Runs the built project.

### `pnpm test`

Runs tests with vitest.

### `pnpm biome-fix`

Runs biome in fix mode to lint and format the project.

### `pnpm typecheck`

Runs type checking using tsc.

### `pnpm register [--dev]`

Registers slash commands globally, or to the dev server if `--dev` flag is provided (requires `DEV_SERVER` env var).

### `pnpm unregister [--dev]`

Unregisters slash commands globally, or from the dev server if `--dev` flag is provided (requires `DEV_SERVER` env var).

## adding or removing commands

Commands are **auto-loaded** from `./src/commands/`. Just create a file and call `createBotCommand`.

**Note:** Discord requires command names to be lowercase. Use kebab-case for multi-word commands (e.g., `my-command`).

1. Create a new file in `./src/commands/` (e.g., `my-command.ts`)
2. Call `createBotCommand` with your command definition:

```ts
import { SlashCommandBuilder } from "discord.js";
import { createBotCommand } from "#/modules/commands";

createBotCommand({
  data: new SlashCommandBuilder().setName("my-command").setDescription("Does something"),
  async execute(interaction) {
    await interaction.reply("Hello!");
  },
});
```

3. Run `pnpm register` to register commands globally (or `pnpm register --dev` for your dev server)
4. Restart your bot

### handling follow-up interactions

For commands with buttons, select menus, or modals, add a `followUp` handler. Use a prefix in `customId` to route interactions back to your command:

```ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from "discord.js";
import { createBotCommand, type FollowUpInteraction } from "#/modules/commands";

createBotCommand({
  data: new SlashCommandBuilder().setName("counter").setDescription("A simple counter"),
  async execute(interaction) {
    const button = new ButtonBuilder()
      .setCustomId("counter:increment") // prefix must match command name
      .setLabel("Click me")
      .setStyle(ButtonStyle.Primary);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
    await interaction.reply({ content: "Count: 0", components: [row] });
  },
  async followUp(interaction: FollowUpInteraction) {
    if (interaction.isButton()) {
      await interaction.reply("Button clicked!");
    }
  },
});
```

## removing commands

1. Run `pnpm unregister` (or `pnpm unregister --dev`) to clean the slate
2. Delete the file from `./src/commands/`
3. Run `pnpm register` (or `pnpm register --dev`) to register commands again
4. Restart your bot

## example commands

The template includes several examples demonstrating different patterns:

| Command      | Description                                          |
| ------------ | ---------------------------------------------------- |
| `ping`       | Simple reply                                         |
| `roll`       | Slash command with options (dropdown selection)      |
| `roll-plus`  | String input parsing with image generation           |
| `roll-panel` | Interactive buttons and select menus with `followUp` |

## architecture

```bash
src/
├── commands/ # Drop command files here — auto-loaded
│ ├── ping.ts
│ ├── roll.ts
│ ├── roll-panel.ts
│ └── roll-plus.ts
├── modules/
│ ├── bot.ts # Client setup, login, graceful shutdown
│ ├── commands.ts # createBotCommand + auto-loader
│ ├── interaction.ts # Dispatches interactions to commands
│ └── logger.ts # Pino logger config
├── utils/ # Shared utilities (dice rolling, image gen)
└── main.ts # Entry point
```

## environment variables

Managed by [envalid](https://github.com/af/envalid) with full type safety:

| Variable               | Description                                                           |
| ---------------------- | --------------------------------------------------------------------- |
| `DISCORD_CLIENT_ID`    | Your Discord application's client ID                                  |
| `DISCORD_CLIENT_TOKEN` | Your Discord bot token                                                |
| `LOG_LEVEL`            | Logging level (`trace`, `debug`, `info`, `warn`, `error`, `fatal`)    |
| `DEV_SERVER`.          | Your Discord test server (target of register/unregister with `--dev`) |

See `./src/env.ts` for the schema definition.

## ci

GitHub Actions runs on pushes and pull requests to `main`, executing tsc, biome check, and tests.

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

This is done by the `.vscode/settings.json` file.

Debug configuration is also included for running the source directly with node.

## TODO

Package `dotenv-cli` is being used while https://github.com/nodejs/node/issues/57040 is not resolved to use node's `--env-file-if-exists` flag.
