#!/usr/bin/env bash
#MISE description="Run tests on staged files"

set -euo pipefail

mise exec -- bun test --pass-with-no-tests --changed --bail --reporter=dots "$@"
