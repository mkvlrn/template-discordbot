# template-discordbot

A sane, opinionated template for discord bots written in typescript using the [discord.js](https://discord.js.org/#/) library.

Uses biomejs, vitest, husky, swc.

## prerequisites

- filled variables in `.env` file (see `.env.example`)
- a notion of what a discord bot is and how `discord.js` works
- a server to test the bot on (that's where you get the server id for the env variable)

## running

### `yarn dev`

This will run the project in watch mode, and will automatically restart on changes. Uses swc to run the typescript code without transpiling to `./build`.

### `yarn build`

This will build the project to `./build`. Again uses swc, but this time it will transpile to esm compatible javascript.

### `yarn start`

This will run the project in production mode. Uses the `./build` directory to run the project.

### `yarn test`

This will run vitest tests once. Use `--watch` to run in watch mode, and `--coverage` to generate coverage reports.

### `yarn tidy`

This will run biome in fix mode (only safe fixes) to lint and format the project. Directories `./src` and `./test`, along with all "loose" compatible files in the root of the project (js, ts, json, jsonc) will be processed.

### `yarn typecheck`

This will run the typescript compiler to check for type errors. Does not transpile any files, only checks the type errors.

## vscode

You might want to install the recommended extensions in vscode (workspace recommended):

- [biomejs.biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [EditorConfig.EditorConfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [ms-vscode.test-adapter-converter](https://marketplace.visualstudio.com/items?itemName=ms-vscode.test-adapter-converter)
- [vitest.explorer](https://marketplace.visualstudio.com/items?itemName=vitest.explorer)

These are the recommended settings (not commited to git because ultimately they are personal). Should be in `.vscode/settings.json` as to not mess with your global settings:

```json
{
  "[css][jsonc][json][javascript][javascriptreact][typescript][typescriptreact]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[markdown][html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "biome.enabled": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.fixAll": "never",
    "source.fixAll.sortJSON": "never",
    "source.organizeImports": "never",
    "source.organizeImports.biome": "explicit",
    "source.sortImports": "never"
  },
  "eslint.enable": false
}
```
