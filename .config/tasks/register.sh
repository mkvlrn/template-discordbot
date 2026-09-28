#!/usr/bin/env bash
#MISE description="Register commands to a server or globally"

mise exec -- node --env-file-if-exists=.env ./src/registration.ts "$@"
