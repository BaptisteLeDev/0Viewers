#!/usr/bin/env sh
# CodeQL + ZAP baseline, local only (gh act). Same engine as ci-local.sh:
# Podman on Windows, Docker on Linux. Pass -j codeql or -j zap for one.
set -e
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) podman machine inspect --format '{{.State}}' | grep -q running || podman machine start ;;
esac
exec gh act workflow_dispatch -W .github/workflows/security.yml "$@"
