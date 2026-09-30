#!/usr/bin/env bash
#MISE description="Sync project dependencies"

mise install
mise prune -y
mise exec -- bun install --frozen-lockfile
