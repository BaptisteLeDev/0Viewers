#!/usr/bin/env sh
# CI runs only here (gh act), never on GitHub. Engine: Podman on
# Windows (machine serves npipe docker_engine), Docker on Linux.
set -e
case "$(uname -s)" in
  MINGW*|MSYS*|CYGWIN*) podman machine inspect --format '{{.State}}' | grep -q running || podman machine start ;;
esac
exec gh act workflow_dispatch -j ci "$@"
