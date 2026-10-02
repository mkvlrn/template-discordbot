#!/usr/bin/env bash
#MISE description="Register commands to a server or globally"

set -euo pipefail

mise exec -- node --env-file-if-exists=.env ./src/registration.ts "$@"
