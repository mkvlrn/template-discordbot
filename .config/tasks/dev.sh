#!/usr/bin/env bash
#MISE description="Run the bot in development mode"

set -euo pipefail

mise exec -- bun --env-file-if-exists=.env --watch ./src/main.ts | mise exec -- pino-pretty
