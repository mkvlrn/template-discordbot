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

- filled variables `DISCORD_CLIENT_ID` and `DISCORD_CLIENT_TOKEN` in `.env` file (see `.env.schema`)
- a notion of what a discord bot is and how `discord.js` works
- a server to test the bot on (that's where you get the server id for the env variable)

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

Commands are imported automatically from the commands directory.

**Note:** Discord requires command names to be lowercase and match the exported variable name. Use kebab-case for multi-word commands (e.g., `my-command`).

1. Create a new file in `./src/commands` named `my-command.ts`
2. Export a command using `createCommand`:

```ts
import { createCommand } from "#/modules/command";

export const mycommand = createCommand("mycommand", "Does something cool", async (interaction) => {
  await interaction.reply("Cool!");
});
```

3. Run `pnpm register-commands [--global]` to register the command in discord
4. Restart your bot

If you don't use the `--global` flag, the command will use the `SERVER_ID` environment variable to register the command in the server. It must be set or the registration will fail.

You can also unregister commands with `pnpm register-commands --unregister [--global]`.

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

This is done by the `.vscode/settings.json` file.

Debug configurations are also included (for source using tsx and for bundle using the generated source maps).
