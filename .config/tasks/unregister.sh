#!/usr/bin/env bash
#MISE description="Unregister commands from a server or globally"

mise exec -- node --env-file-if-exists=.env ./src/registration.ts --unregister "$@"
