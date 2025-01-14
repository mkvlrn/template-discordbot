# template-discordbot

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library.

Uses:

- [biome](https://github.com/biomejs/biome) for linting and formatting
- [tsx](https://github.com/privatenumber/tsx) for running typescript code without transpiling
- [vitest](https://github.com/vitest-dev/vitest) for tests
- [commitlint](https://github.com/conventional-changelog/commitlint) for linting commit messages
- [husky](https://github.com/typicode/husky) for git hooks

## prerequisites

- filled variables in `.env` file (see `.env.example`)
- a notion of what a discord bot is and how `discord.js` works
- a server to test the bot on (that's where you get the server id for the env variable)

## running

### `yarn dev`

Runs the project in watch mode, automatically restarting on changes. Uses [tsx](https://github.com/privatenumber/tsx) to run the typescript code without transpiling to `./build`.

### `yarn build`

Builds/transpiles the code to `./build`.

### `yarn start`

Runs the built project.

### `yarn register <serverId>`, `yarn register global`

Registers all bot commands in `./commands` to the specified discord server or globally. Read more [here](https://discordjs.guide/creating-your-bot/command-deployment.html#registering-slash-commands).

### `yarn test`, `yarn test:integration`, `yarn test:e2e`

Runs unit/integration/e2e tests with vitest.

### `yarn tidy`

Runs biome in fix mode (only [safe fixes](https://biomejs.dev/linter/#safe-fixes)) to lint and format the project. Not only `./src`, but also all "loose" config files around root (js, ts, json, jsonc) or other directories.

### `yarn typecheck`

Runs typechecking using tsc and the `tsconfig.json` file, which is not the one used to build the project.

## that tsconfig.json seems very strict and opinionated

Yup.

## vscode

You might want to install the recommended extensions in vscode. Search for **@recommended** in the extensions tab, they'll show up as _"workspace recommendations"_.

If you have been using eslint and prettier and their extensions, you might want to disable eslint entirely and keep prettier as the formatter only for certain types of files.

I suggesting using the settings in `.vscode/settings-example.json`, that should be pasted into your own `.vscode/settings.json`. I'm not commiting the `.vscode/settings.json` proper because it shouldn't be in VCS as it contains your personal settings.
