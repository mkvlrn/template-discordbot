#!/usr/bin/env bash
#MISE description="Run tests in CI mode"

mise exec -- bun test --bail --reporter=dots "$@"
