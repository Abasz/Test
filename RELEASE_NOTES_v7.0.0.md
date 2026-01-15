# ESP Rowing Monitor v7.0.0 Release

This major release introduces an advanced cyclic error filtering system for improved metric accuracy, a new calibration helper GUI tool, significant performance improvements, and includes breaking changes to the BLE API that require updated clients.

The cyclic error filtering feature allows cleaner force curves and potentially reduces the required `IMPULSE_DATA_ARRAY_LENGTH` while yielding more accurate metrics. Combined with additional performance optimizations (approx. 13-15% improvement), the overall accuracy and responsiveness of ESP Rowing Monitor has been significantly enhanced.

## ⚠️ Breaking Changes

### Stroke Detection Settings BLE Characteristic

The `minimumRecoverySlopeMargin` setting has been **removed** from the firmware as it was made obsolete by the `driveHandleForcesMaxCapacity` setting:

- **Stroke Detection Settings Characteristic** payload size changed from **15 bytes to 11 bytes**
- Old GUI clients sending the 15-byte payload will receive an `InvalidParameter` BLE error
- Firmware will **not** accept or parse old-format payloads
- **Required action**: Use the latest version of the [WebGUI](https://abasz.github.io/ESPRowingMonitor-WebGUI/)

See [Custom BLE Services](docs/custom-ble-services.md#settings-service) for the updated byte layout.

### Extended Metrics BLE Characteristic

The `dragFactor` field in the Extended Metrics characteristic has been changed from 8-bit (1 byte) to 16-bit (2 bytes, unsigned short, Little Endian):

- **Extended Metrics (UUID: 808a0d51-efae-4f0c-b2e0-48bc180d65c3)** now reports `dragFactor` as a 16-bit unsigned value rather than 8-bit
- This change fixes [issue #21](https://github.com/Abasz/ESPRowingMonitor/issues/21) where machines with higher drag factors (e.g., magnetic and water rowers exceeding 255) couldn't be properly represented
- Old clients that read a single byte will misinterpret values or parse the payload incorrectly if the actual value is above 255 (if below, backward compatibility is maintained)

## New Features

### Cyclic Error Filtering

- **Advanced Sensor Data Filtering**: Introduced a cyclic error filtering system (`CyclicErrorFilter` and `ExponentialWeightedAverage` class) that mitigates cyclic errors in sensor data, improving the accuracy of stroke detection.
- **Cleaner Force Curves**: The filter produces cleaner handle force curves by correcting impulse timing variations caused by mechanical imperfections in the flywheel magnet placement.
- **Reduced Data Requirements**: The cyclic error correction potentially allows using a smaller `IMPULSE_DATA_ARRAY_LENGTH` while maintaining or improving metric accuracy.

### Configurable BLE Update Interval

- **Per-Profile BLE Update Control**: Added `MIN_BLE_UPDATE_INTERVAL` setting that allows configuring the minimum BLE update interval on a per-profile basis (aims to address issue #24 to some extent) while keeping the default behaviour unchanged (i.e. 4 seconds).

### Calibration Helper Desktop GUI (cross-platform)

- **New Calibration Tool**: A ready-to-use desktop GUI for analyzing and visualizing calibration data is now provided for Windows, Linux, and macOS.
- **Delta Time Analysis**: Visualize raw vs. cleaned delta times from the cyclic error filter to understand sensor data quality.
- **Handle Force Visualization**: Iterate over handle force curves for each stroke with navigation controls.
- **Stroke Detection Analysis**: Identify missed or duplicate strokes using Theil-Sen regression analysis.
- **Distributed with releases**: Platform-specific assets are attached to releases:
  - Windows: standalone executable (.exe)
  - Linux: standalone executable
  - macOS: .app bundle packaged as a .tar.gz

### Support for Kettler Stroker

- Add rower profile to support Kettler Stroke (thanks @Double-A-92)

## Updates and Improvements

### Performance Optimizations

- **Algorithm Efficiency**: Refactored series calculations to use `std::ranges`, `emplace_back`, and bit manipulation instead of modulo operator for improved performance and readability.
- **Memory Management Fix**: Fixed a bug in manual vector memory allocation management that was causing unnecessary overhead.
- **Overall Improvement**: Combined optimizations result in approximately 13-15% performance improvement in the main calculation loop.

### Deep Sleep Power Consumption

- **Improved Deep Sleep**: Added `gpio_deep_sleep_hold_en` to the sensor on/off switch pin to reduce power consumption during deep sleep mode.

### Documentation Improvements

- **Community FAQ**: Added comprehensive FAQ documentation derived from GitHub discussions, providing community-validated solutions, hardware-specific guidance, and troubleshooting workflows for common setup and calibration questions.
- **DeepWiki Integration**: Created DeepWiki configuration (`.devin/wiki.json`) enabling AI-assisted documentation generation focused on helping new users with setup, calibration, and troubleshooting. [Interactive documentation](deepwiki.com/Abasz/ESPRowingMonitor) is available generated by DeepWiki.
- **Enhanced Settings Documentation**: Added extensive cross-references between settings.md and FAQ entries for improved discoverability of calibration guidance and hardware setup information and updated links.

### Code Quality Improvements

- **Modern C++ Adoption**: Refactored codebase to use C++ ranges library (`std::ranges`) for improved readability and performance.
- **Type Safety**: Added `[[nodiscard]]` attributes to various methods to prevent accidental ignoring of return values.
- **Enum Improvements**: Refactored typedefs to `using` declarations and improved enum class usage.
- **Standard Library Qualification**: Qualified certain math functions with `std::` for proper namespace usage.
- **Null Pointer Safety**: Replaced `NULL` with `nullptr` throughout the codebase.
- **Linting Cleanup**: Fixed various linting errors and updated NOLINT comments.

### Build System and Testing

- **CMake Improvements**: Refactored CMake scripts for improved structure and better support for custom environment targets in e2e tests.
- **Extended Series Functionality**: Enhanced series classes with extended functionality and improved test coverage.
- **Testing Library Updates**: Updated FakeIt  mocking library and Catch2 to their latest version.

## Bug Fixes

- **Drag Factor Size Bug**: Fixed issue #21 where drag factor was limited to 255 due to 8-bit storage, now supports 16-bit values for machines with higher drag factors.
- **Zero Division in FTMS**: Fix zero division in the calculation of stroke rate and pace for FTMS causing undefined behaviour. (Thanks @Double-A-92)
- **Handle Force Curves Alignment**: Fixed handle force curves being shifted by one data point by adding `torqueBeforeFlank` tracking in StrokeService.
- **Control Point Write Flag**: Added `WRITE_NR` (Write Without Response) flag to BLE control points for improved compatibility.
- **Instant Sleep Bug**: Fixed instant sleep bug in runtime test scenarios.
- **CI/CD Fixes**: Fixed test CI workflow and improved compilation time.

## Code Refactoring and Maintenance

- **Drag Coefficient Calculation**: Refactored drag coefficient calculation for improved clarity and maintainability.
- **HandleForces and DeltaTimes Task**: Refactored background tasks for better organization.
- **Settings Deprecation**: Removed `minimumRecoverySlopeMargin` from all rower profiles and settings models as it became redundant with the `driveHandleForcesMaxCapacity` setting.

## Notes

- **BLE Client Updates Required**: Due to the breaking changes in BLE characteristics, all clients (including the WebGUI) must be updated to the latest version to work with this release.
- **Drag Factor Compatibility**: The drag factor change from 8-bit to 16-bit maintains backward compatibility for values below 256, but clients parsing the extended metrics characteristic should be updated to read 2 bytes for the drag factor field.
- **Calibration Helper**: The new calibration helper GUI tool is distributed alongside the ESPTool GUI and can be used independently for analyzing recorded session data.

Full Changelog: [6.2.0...7.0.0](https://github.com/Abasz/ESPRowingMonitor/compare/6.2.0...7.0.0)
