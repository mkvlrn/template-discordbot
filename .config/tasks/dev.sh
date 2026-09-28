#!/usr/bin/env bash
#MISE description="Run the bot in development mode"

mise exec -- bun --env-file-if-exists=.env --watch ./src/main.ts | mise exec -- pino-pretty
