#!/usr/bin/env bash
#MISE description="Run tests with coverage"

set -euo pipefail

mise exec -- bun test --pass-with-no-tests --coverage "$@"
