#!/usr/bin/env bash
#MISE description="Sync project dependencies"

set -euo pipefail

mise install
mise prune -y
