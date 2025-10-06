echo "🔨 Building binaries"
environments=$(platformio project config | grep -oP '^env:\K(?!(.*debug|custom)).*')
echo
echo "Environments:"
mapfile -t env_array <<< "$environments"
for env in "${env_array[@]}"; do
            echo "- ${env}"
done
# pio run $(echo "${environments}" | sed 's/^/-e /' | paste -sd ' ' -)

echo
echo "Create zip"
echo
  set -eo pipefail
          mkdir -p release_assets
          shopt -s nullglob

          for dir in ".pio/build"/*/; do
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
            chip_id_safe=$(echo "${chip_id}" | sed -E 's/[^A-Za-z0-9._-]//g')

            zipname="release_assets/firmware_${environmentName}_${chip_id_safe}.zip"
            echo "Creating zip: ${zipname} (bin: ${binfile})"
            zip -j -q "${zipname}" "${binfile}"
          done