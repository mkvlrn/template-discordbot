#!/usr/bin/env bash
#MISE description="Run tests in CI mode"

mise exec -- vitest --bail=1 --reporter=github-actions
