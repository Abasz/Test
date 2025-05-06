#/bin/bash
mkdir -p release_assets
for ENV_DIR in ./.pio/build/*/; do
            ENV_NAME=$(basename "$ENV_DIR")
            echo "Create asset: $ENV_NAME"
            BIN_FILES=$(find "$ENV_DIR" -maxdepth 1 -type f -name '*.bin')
            ZIP_NAME="firmware-${ENV_NAME}.zip"
	echo "zip -j release_assets/$ZIP_NAME $BIN_FILES"
done