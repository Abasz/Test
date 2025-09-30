echo "🔨 Building binaries"
environments=$(platformio project config | grep -oP '^env:\K(?!(.*debug|custom)).*')
echo
echo "Environments:"
mapfile -t env_array <<< "$environments"
for env in "${env_array[@]}"; do
            echo "- ${env}"
done
pio run $(echo "${environments}" | sed 's/^/-e /' | paste -sd ' ' -)

echo
echo "Create zip"
echo

mkdir -p release_assets
for dir in .pio/build/*/; do
  environmentName=$(basename "${dir}")
  echo "Create asset: ${environmentName}"
  find "${dir}" -maxdepth 1 -type f -name '*.bin' -print | zip -j "release_assets/firmware-${environmentName}.zip" -@
done
