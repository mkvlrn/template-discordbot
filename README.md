# template-discordbot

![build](https://img.shields.io/github/actions/workflow/status/mkvlrn/template-discordbot/checks.yml?branch=main&style=flat&logo=github)
[![template](https://img.shields.io/badge/template-use_this_template-2ea44f?style=flat&logo=github)](https://github.com/mkvlrn/template-discordbot/generate)
[![mise](https://mise-versions.jdx.dev/badge.svg)](https://mise.jdx.dev)
![license](https://img.shields.io/github/license/mkvlrn/template-discordbot?style=flat)

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library. It doesn't rely on transpilation - typescript is ran directly by node (v24+, as pinned in the mise config).

> [!IMPORTANT]
> This template requires **mise**. It manages the correct versions of runtimes and tooling, such as Node itself, pnpm, and others.
>
> It is also the task manager for the project, so no `package.json` scripts.
>
> Check https://mise.jdx.dev for more details on **mise**, and the tasks section below (or the `.mise.toml` file) for the available tasks.

Uses, among other tools/packages:

- [pnpm](https://github.com/pnpm/pnpm) as package manager for node
- [biome](https://github.com/biomejs/biome) for code linting and formatting
- [lefthook](https://github.com/evilmartians/lefthook) for git hooks
- [cocogitto](https://github.com/cocogitto/cocogitto) for commit message linting
- [vitest](https://github.com/vitest-dev/vitest) for testingypescript
- [envalid](https://github.com/af/envalid) for env validation and parsing
- [@mkvlrn/result](https://github.com/mkvlrn/tools/blob/main/packages/result/README.md) for error handling
- [infisical](https://github.com/Infisical/infisical) for secrets/envs

## setup

To ensure a reproducible environment, [mise](https://mise.jdx.dev/) is used:

1. **Install mise**: https://mise.jdx.dev/getting-started.html#installing-mise-cli
2. **Activate mise**: https://mise.jdx.dev/getting-started.html#activate-mise
3. **Run setup**:
   ```bash
   mise setup
   ```

This task trusts the project config, installs CLI tools (Node, pnpm, ncu, infisical), and runs pnpm install. All other scripts are standard package.json commands.

> [!NOTE]
> Git hooks are in place to make sure both the tooling managed by mise and the project dependencies are synced with each checkout and merge.

## subpath imports

Subpath imports (`#/`) are used instead of relative paths, mapped in both `package.json` and `tsconfig.json`.

**Example**:

```ts
import { add } from "#/math/basic"; // this points to ./src/math/basic.ts
```

## secrets

A free infisical account for secret management should be used (although you could get away with using an `.env` file and loading it up with the `--env-file` flag for node).

Create a project there setting the following secrets:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_TOKEN`
- `DEV_SERVER`
- `LOG_LEVEL`

Authenticate with the cli with `infisical login` and follow the steps.

Finally, run `infisical init` to ovewrite the file present in this template (this points to my own project, that requires my authentication, so this file is just a placeholder).

The `dev`, `start`, `register`, and `unregister` npm scripts are already wired to use infisical to inject the secrets into the node process.

## running

### `mise dev`

Runs the project in watch mode.

### `mise start`

Runs the built project.

### `mise test`

Runs tests with vitest.

### `mise biome-fix`

Runs biome in fix mode to lint and format the project.

### `mise typecheck`

Runs type checking using tsc.

### `mise register [--dev]`

Registers slash commands globally, or to the dev server if `--dev` flag is provided

### `mise unregister [--dev]`

Unregisters slash commands globally, or from the dev server if `--dev` flag is provided

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

## npm-check-updates

This global package is managed by mise as it is used as a global tool. Simply running `ncu` will list possible updates from `package.json`. `ncu -u` will set those versions in `package.json`, and `pnpm install` will upgrade them.

For more info, https://github.com/raineorshine/npm-check-updates .

## ci

This repository uses GitHub Actions for CI. The workflow is defined in `.github/workflows/checks.yml`.

It automates:

- **Linting & Formatting**: Running Biome.
- **Type Checking**: Running TypeScript type checking.
- **Testing**: Running Vitest with code coverage (generated by Istanbul).

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

This is done by the `.vscode/settings.json` file.

Debug configuration is also included for running the source directly with node.

## license

MIT
