#!/usr/bin/env bash
#MISE description="Sync project dependencies"

mise install
mise prune -y
mise exec -- pnpm install --frozen-lockfile
