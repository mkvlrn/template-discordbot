#!/usr/bin/env bash
#MISE description="Run tests in CI mode"

set -euo pipefail

mise exec -- bun test --pass-with-no-tests --bail --reporter=dots "$@"
