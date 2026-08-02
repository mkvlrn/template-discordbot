# template-discordbot

![build](https://img.shields.io/github/actions/workflow/status/mkvlrn/template-discordbot/checks.yml?branch=main&style=flat&logo=github)
[![template](https://img.shields.io/badge/template-use_this_template-2ea44f?style=flat&logo=github)](https://github.com/mkvlrn/template-discordbot/generate)
[![mise](https://mise-versions.jdx.dev/badge.svg)](https://mise.jdx.dev)
![license](https://img.shields.io/github/license/mkvlrn/template-discordbot?style=flat)

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library. It doesn't rely on transpilation - typescript is executed directly by node.

> [!CAUTION]
> This template requires [mise](https://mise.jdx.dev) to manage runtimes, tools, and tasks in a single workflow, providing a lightweight alternative to devcontainers.
>
> You must [install mise](https://mise.jdx.dev/installing-mise.html) before starting. If you prefer a less opinionated setup, this template isn't for you.

Uses, among other tools/packages:

- [pnpm](https://github.com/pnpm/pnpm) as package manager for node
- [biome](https://github.com/biomejs/biome) for code linting and formatting
- [lefthook](https://github.com/evilmartians/lefthook) for git hooks
- [commitlint](https://github.com/conventional-changelog/commitlint) for commit message linting
- [vitest](https://github.com/vitest-dev/vitest) for testing
- [varlock](https://github.com/dmno-dev/varlock) for env validation and parsing

## requirements and dependencies

As noted at the top, you need [mise](https://mise.jdx.dev) to get started with this template. Run `mise install` in the project root to fetch the pinned versions of Node and other tools locally.

This is _by far_ the easiest way to keep your environment consistent across different machines and team members, no matter the frequency of version updates.

Once the tooling is installed, you can install the Node dependencies with `pnpm install`.

> [!NOTE]
> Git hooks are in place to make sure both the tooling managed by mise and the project dependencies are synced with each checkout and merge.

## subpath imports

Subpath imports (`#/`) are used instead of relative paths, mapped via the `imports` field in `package.json` (allowing native Node resolution at runtime without extra build tools) and mirrored in `tsconfig.json` for IDE support.

**Example**:

```ts
import { add } from "#/lib/math"; // this points to ./src/lib/math.ts
```

## secrets

An untracked, local `.env` file can be used during development, and you can load it up with the `--env-file` flag for node.

Create a project there setting the following secrets:

- `DISCORD_CLIENT_ID`
- `DISCORD_CLIENT_TOKEN`
- `DEV_SERVER`
- `LOG_LEVEL`

The `dev`, `register`, and `unregister` npm scripts use the `.env` file by default, although you should probably use something else for secret management, such as [doppler](https://www.doppler.com/) or others.

Varlock is used to validate these vars and you should [read more about it](https://varlock.dev/getting-started/introduction/) if you care about how it works precisely, but just having an `.env` file with the correct values is enough to just use it as is.

## running

### `mise dev`

Runs the project in watch mode.

### `mise test`

Runs tests.

### `mise lint-fix`

Runs biome in fix mode to lint and format the project.

### `mise typecheck`

Runs type checking using tsc.

### `mise register [--dev]`

Registers slash commands globally, or to the dev server if `--dev` flag is provided

### `mise unregister [--dev]`

Unregisters slash commands globally, or from the dev server if `--dev` flag is provided

## adding or removing commands

Commands are _**not**_ auto-loaded from `./src/commands/`, they are exported and imported like any other typescript module..

**Note:** Discord requires command names to be lowercase. Use kebab-case for multi-word commands (e.g., `my-command`).

1. Create a new file in `./src/commands/` (e.g., `my-command.ts`)
2. Create your command definition (which should satisfy `BotCommand`) and export it.

```ts
// src/commands/my-command.ts
import { SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/core/commands";

const data = new SlashCommandBuilder().setName("my-command").setDescription("Does something");

async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.reply("Something");
}

export const myCommand = {
  data,
  execute,
} satisfies BotCommand;
```

3. Import the command into `./src/core/commands.ts` and add it to the commands Map

```ts
// src/core/commands.ts
import { myCommand } from "#/commands/my-command";

// ...

export const commands = new Map<string, BotCommand>([["my-command", myCommand]]);
```

4. Run `pnpm register` to register commands globally (or `pnpm register --dev` for your dev server)
5. Restart your bot

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
