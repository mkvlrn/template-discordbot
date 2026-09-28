#!/usr/bin/env bash
#MISE description="Regenerate dependency lockfiles"

rm -f pnpm-lock.yaml
mise exec -- pnpm install

git add pnpm-lock.yaml
git commit -m "chore(deps): update lockfile"
