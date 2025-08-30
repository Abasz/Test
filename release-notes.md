# Version 6.2.0

This release introduces runtime-configurable settings over BLE, expands the Settings Service, adds new ergometer profiles, improves tooling and adds CI, and includes multiple fixes and refinements.

The runtime-configurable settings capability (that allows dynamic configuration changes without requiring firmware recompilation) significantly enhances the flexibility and usability of the program while maintains backward compatibility for users who prefer compile-time settings. The improvements in BLE functionality and hardware support make the system more accessible and easier to configure for a wider range of users and hardware setups.

## New Features

### Runtime Settings Framework

- **Dynamic Configuration Management**: Introduced a comprehensive runtime settings system that allows users to modify rower profile configuration parameters via BLE without requiring firmware recompilation (please see details [below](#ble-and-connectivity-enhancements)).
- **NVS Storage Integration**: Settings are now persisted in Non-Volatile Storage (NVS) and automatically loaded on startup when runtime settings are enabled.
- **Opt-in Architecture**: Runtime settings use a "pay for what you use" approach via compiler flags, ensuring minimal overhead when not needed.

### Enhanced BLE Configuration Capabilities

- **Stroke Detection Settings Control**: Added new BLE characteristic and Control Point OpCode to dynamically adjust stroke detection parameters including impulse data array length and stroke detection algorithms.
- **Drag Factor Configuration**: Implemented BLE endpoints for runtime adjustment of drag factor calculation parameters.
- **Sensor Signal Filter Settings**: Added capability to configure sensor signal filtering parameters through BLE.
- **Machine Settings Management**: Exposed machine-specific settings (flywheel inertia, sprocket radius, etc.) via BLE for runtime modification.
- **Device Restart Control**: Added Control Point OpCode to allow remote device restart via BLE.
- **Enhanced Validation**: Added centralized validation logic including cross-validation for settings to ensure compatibility and prevent invalid configurations.

### Improved Device Identification

- **Auto-Generated Serial Numbers**: Serial numbers can now automatically generated from the device MAC address when not explicitly provided.
- **Flexible Device Naming**: Added options to include/exclude serial numbers and BLE service flags in the device name.
- **Device Name Length Validation**: Implemented compiler checks to ensure device names don't exceed 18 characters for better compatibility with devices like Garmin watches.

### Experimental Hardware Support

- **OldDanube Kayak Ergs**: Added initial experimental support for OldDanube Kayak Ergs with 6-magnet configuration (settings subject to change as hardware development continues).

## Updates and Improvements

### BLE and Connectivity Enhancements

- **Garmin Pairing Fix**: Resolved pairing issues with newer Garmin firmware by enabling appropriate security layers for Open/Secure Connection compatibility.
- **Connection Tracking Management**: Improved connection tracking and management for better performance and reliability.

### Performance Optimizations

- **Series Class Refactoring**: Optimized series classes for improved performance during data processing.
- **Memory Management**: Improved memory usage patterns and reduced overhead in critical code paths.

### Hardware and Board Support

- **Wake-up Pin Reliability**: Fixed wake-up issues on ESP32-S3 boards by ensuring RTC pin pullup is maintained during deep sleep.
- **Generic Board Profile**: Updated LED pin definition to use GPIO_NUM_NC for boards without built-in LEDs.
- **Board Configuration Matrix**: Restructured platformio configuration to support a matrix of board and profile combinations.

### Development and Build System Improvements

- **CMake Migration**: Moved from single-header test frameworks to CMake-based compilation for faster build times.
- **CI/CD Integration**: Added GitHub Actions workflows for automated building and testing including the automatic attaching of the precompiled downloadable firmware for different boards and rowers to the latest release.
- **Environment Management**: Created comprehensive build matrix supporting multiple board and profile combinations.
- **Installation Scripts**: Added installer and auto-compiler scripts for simplified setup and configuration (works only under Linux).

## Bug Fixes

- **Sprocket Radius Setting**: Fixed implicit conversion bug that caused incorrect float-to-int conversion in macro definitions.
- **Drag Coefficient Calculation**: Relaxed requirements for drag factor calculation to improve initial detection and recovery from resets.
- **Compiler Warnings**: Resolved various linting errors and compiler warnings related to SdFat, LittleFS, and macro redefinitions.

## Code Refactoring and Maintenance

- **Settings Model Separation**: Separated settings models into dedicated headers for improved code organization by extracting the rower profile configurations class.
- **Callback Renaming**: Renamed callback classes to better reflect their functions (e.g., ConnectionManagerCallbacks to SubscriptionManagerCallbacks).
- **Logging Library Update**: Switched to a fork of ArduinoLog that supports class enums to eliminate compilation warnings.

## Notes

- **Runtime Settings**: When runtime settings are enabled, some configuration parameters are now loaded from NVS instead of compile-time constants, which may require reconfiguration for existing setups.
- **BLE Device Names**: Device naming conventions have changed with new options for serial number and service flag inclusion, which may affect device recognition by previously paired clients (defaults are set so previous behaviur is kept).

**Full Changelog**: [6.0.1...6.2.0](https://github.com/Abasz/ESPRowingMonitor/compare/6.0.1...6.2.0)
