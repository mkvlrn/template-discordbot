#!/usr/bin/env bash
#MISE description="Run tests with coverage"

mise exec -- bun test --coverage "$@"
