#!/usr/bin/env bash
#MISE description="Run tests in CI mode"

mise exec -- bun test --pass-with-no-tests --bail --reporter=dots "$@"
