#!/bin/bash

set -eo pipefail

# Get the current directory as the workspace
WORKSPACE="$(pwd)"

# environments=$(grep -oP '^\[env:\K(?!.*(?:debug|custom|dynamic)).*(?=\])' < "platformio.ini")
# for environment in $(echo "${environments}" | cut -d'-' -f1 | sort -u); do
#     "$WORKSPACE/build/test/calibration/run-calibration" "${environment}-generic"
# done

echo "🔨 Building binaries"
environments=$(platformio project config | grep -oP '^env:\K(?!(.*debug|custom)).*')
echo
echo "Environments:"
mapfile -t env_array <<< "$environments"
for env in "${env_array[@]}"; do
  echo "- ${env}"
done
echo
read -r -a commandArgs < <(echo "${environments}" | sed 's/^/-e /' | paste -sd ' ' -)
pio run "${commandArgs[@]}"

echo
echo "📦 Prepare zipped firmware binaries"
mkdir -p firmware
shopt -s nullglob

for dir in "${WORKSPACE}/.pio/build"/*/; do
  environmentName=$(basename "${dir}")
  echo "Processing environment: ${environmentName}"

  # Require the canonical firmware file produced by PlatformIO
  binfile="${dir}firmware.bin"
  if [ ! -f "${binfile}" ]; then
    echo "ERROR: expected firmware binary '${binfile}' not found for environment ${environmentName}"
    exit 1
  fi
  echo "Using firmware: ${binfile}"

  chip_id=$(esptool image_info "${binfile}" 2>&1 | sed -nE 's/.*Chip ID:.*\(([^)]+)\).*/\1/p')

  # sanitize chip_id to safe filename chars
  chip_id_safe=$(echo "${chip_id}" | sed -E 's/[^A-Za-z0-9._]//g')

  zipname="${WORKSPACE}/firmware/firmware_${environmentName}_${chip_id_safe}.zip"
  echo "Creating zip: ${zipname} (all .bin files in ${dir})"
  # include all .bin files from this environment folder
  find "${dir}" -maxdepth 1 -type f -name '*.bin' -print | zip -j -q "${zipname}" -@
done

echo "✅ Build complete! Firmware binaries are in firmware/"