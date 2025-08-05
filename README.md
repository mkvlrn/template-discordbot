# template-discordbot

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library.

For new, node 24+ projects.

Uses:

- [biome](https://github.com/biomejs/biome) for linting and formatting
- [commitlint](https://github.com/conventional-changelog/commitlint) for linting commit messages
- [husky](https://github.com/typicode/husky) for git hooks
- [lint-staged](https://github.com/lint-staged/lint-staged) for checks on commit
- [vite](https://github.com/vitejs/vite) for building
- [vitest](https://github.com/vitest-dev/vitest) for testing
- [tsx](https://github.com/privatenumber/tsx) for dev time typescript

## prerequisites

- filled variables in `.env` file (see `.env.example`)
- a notion of what a discord bot is and how `discord.js` works
- a server to test the bot on (that's where you get the server id for the env variable)

## running

### `npm run dev`

Runs the project in watch mode.

### `npm run build`

Builds/transpiles the code to `./build`.

### `npm start`

Runs the built project.

### `npm test`

Runs tests with vitest.

### `npm run biome-fix`

Runs biome in fix mode (only [safe fixes](https://biomejs.dev/linter/#safe-fixes)) to lint and format the project.

### `npm run typecheck`

Runs type checking using tsc.

## that tsconfig.json seems very strict and opinionated

Yup.

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

This is done by the `.vscode/settings.json` file.

Debug configurations are also included (for source using tsx and for bundle using the generated source maps).
