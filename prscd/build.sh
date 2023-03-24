#!/usr/bin/env bash

set -e

# prscd build script for Linux
# Environment variable options:
#   - PRSCD_VERSION: App version
#   - PRSCD_PLATFORMS: Platforms to build for (e.g. "windows/amd64,linux/amd64,darwin/amd64")

export LC_ALL=C
export LC_DATE=C

has_command() {
    local cmd="$1"
    type -P "$cmd" > /dev/null 2>&1
}

if ! has_command go; then
    echo 'Error: go is not installed.' >&2
    exit 1
fi

if ! has_command git; then
    echo 'Error: git is not installed.' >&2
    exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo 'Error: not in a git repository.' >&2
    exit 1
fi


make_ldflags() {
    local ldflags="-s -w -X 'main.appDate=$(date -u '+%F %T')'"
    if [ -n "$PRSCD_VERSION" ]; then
        ldflags="$ldflags -X 'main.appVersion=$PRSCD_VERSION'"
    else
        ldflags="$ldflags -X 'main.appVersion=$(git describe --tags --always --match 'v*')'"
    fi
    echo "$ldflags"
}

build_for_platform() {
    local platform="$1"
    local ldflags="$2"

    local GOOS="${platform%/*}"
    local GOARCH="${platform#*/}"
    if [[ -z "$GOOS" || -z "$GOARCH" ]]; then
        echo "Invalid platform $platform" >&2
        return 1
    fi
    echo "Building $GOOS/$GOARCH"
    local output="build/prscd-$GOOS-$GOARCH"
    if [[ "$GOOS" = "windows" ]]; then
        output="$output.exe"
    fi
    local exit_val=0
    go build -o "$output" -ldflags "$ldflags" -trimpath || exit_val=$?
    if [[ "$exit_val" -ne 0 ]]; then
        echo "Error: failed to build $GOOS/$GOARCH" >&2
        return $exit_val
    fi
}


if [ -z "$PRSCD_PLATFORMS" ]; then
    PRSCD_PLATFORMS="$(go env GOOS)/$(go env GOARCH)"
fi
platforms=(${PRSCD_PLATFORMS//,/ })
ldflags="$(make_ldflags)"

mkdir -p build
rm -rf build/*

echo "Starting build..."

for platform in "${platforms[@]}"; do
    build_for_platform "$platform" "$ldflags"
done

echo "Build complete."

ls -lh build/ | awk '{print $9, $5}'
