#!/usr/bin/env bash
#MISE description="Run tests on staged files"

mise exec -- bun test --pass-with-no-tests --changed --bail --reporter=dots "$@"
