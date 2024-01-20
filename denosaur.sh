#!/bin/sh
# Copyright 2024 Jay Bazuzi. All rights reserved. MIT license.
# TODO(everyone): Keep this script simple and easily auditable.

set -e

SCRIPT_DIR=$(CDPATH="" cd -- "$(dirname -- "$0")" && pwd)
SCRIPT_NAME=$(basename -- "$0")

error_and_exit() {
    1>&2 echo "$SCRIPT_NAME: Error: $*"
    exit 1
}

# Taken from https://deno.land/x/install@v0.1.8/install.sh
if ! command -v unzip >/dev/null; then
	error_and_exit "unzip is required to install Deno (see: https://github.com/denoland/deno_install#unzip-is-required )."
fi

if [ "${OS}" = "Windows_NT" ]; then
	target="x86_64-pc-windows-msvc"
else
	case $(uname -sm) in
		"Darwin x86_64") target="x86_64-apple-darwin" ;;
		"Darwin arm64") target="aarch64-apple-darwin" ;;
		"Linux aarch64")
			error_and_exit "Official Deno builds for Linux aarch64 are not available. (see: https://github.com/denoland/deno/issues/1846 )"
			;;
		*) target="x86_64-unknown-linux-gnu" ;;
	esac
fi
# End install.sh snippet

DENO_VERSION_FILE="$SCRIPT_DIR/.deno_version"
if [ -f "${DENO_VERSION_FILE}" ]; then
	deno_version=$(cat "${DENO_VERSION_FILE}")
else
    error_and_exit ".deno_version file not found."
fi

deno_uri="https://github.com/denoland/deno/releases/download/${deno_version}/deno-${target}.zip"

deno_install="${HOME}/.denosaur/deno-${deno_version}"
bin_dir="${deno_install}/bin"
exe="${bin_dir}/deno"

if [ ! -f "${exe}" ]; then
	if [ ! -d "${bin_dir}" ]; then
		mkdir -p "${bin_dir}"
	fi

	if ! curl --fail --location --silent --output "${exe}.zip" "${deno_uri}"; then
		error_and_exit "failed to download ${deno_uri}"
	fi
	unzip -q -d "${bin_dir}" -o "${exe}.zip"
	chmod +x "${exe}"
	rm "${exe}.zip"
fi

${exe} "${@}"
