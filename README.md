# template-discordbot

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library.

For new, node lts (currently v24) projects.

Uses:

- [biome](https://github.com/biomejs/biome) for linting and formatting
- [commitlint](https://github.com/conventional-changelog/commitlint) for linting commit messages
- [husky](https://github.com/typicode/husky) for git hooks
- [lint-staged](https://github.com/lint-staged/lint-staged) for checks on commit
- [vitest](https://github.com/vitest-dev/vitest) for testing
- [tsx](https://github.com/privatenumber/tsx) for dev time typescript
- [varlock](https://github.com/dmno-dev/varlock) for env validation and parsing
- [tsdown](https://github.com/rolldown/tsdown) for building

## prerequisites

- variables `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_TOKEN`, and `LOG_LEVEL` filled in `.env` file (see `.env.schema`)
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

Runs biome in fix mode (only [safe fixes](https://biomejs.dev/linter/#safe-fixes)) to lint and format the project.

### `pnpm typecheck`

Runs type checking using tsc.

## adding or removing commands

Commands live in `./src/commands/` as individual files and are registered in `./src/modules/commands.ts`.

**Note:** Discord requires command names to be lowercase. Use kebab-case for multi-word commands (e.g., `my-command`).

1. Create a new file in `./src/commands/` (e.g., `my-command.ts`)
2. Export a typed `BotCommand` object with `data` and `execute`:

```ts
import { type CommandInteraction, SlashCommandBuilder } from "discord.js";
import type { BotCommand } from "#/modules/commands";

async function execute(interaction: CommandInteraction): Promise {
  await interaction.reply("Hello!");
}

export const myCommand: BotCommand = {
  data: new SlashCommandBuilder().setName("my-command").setDescription("Does something"),
  execute,
};
```

3. Import and add the command to the `commands` Map in `./src/modules/commands.ts`:

```ts
import { myCommand } from "#/commands/my-command";

export const commands = new Map([[myCommand.data.name, myCommand]]);
```

4. Run `pnpm cmd register global` to register commands globally or `pnpm cmd register 0000000000` to a specific server
5. Restart your bot

You can also unregister commands with `pnpm cmd unregister global` or `pnpm cmd unregister 0000000000`.

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

This is done by the `.vscode/settings.json` file.

Debug configurations are also included (for source using tsx and for bundle using the generated source maps).
