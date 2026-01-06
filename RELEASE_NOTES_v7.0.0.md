# Version 7.0.0

This release marks a major milestone with significant architectural improvements, new export capabilities, enhanced firmware update functionality, and a full migration to modern testing infrastructure. The update ensures compatibility with ESPRM firmware v7.0.0 API changes while maintaining backward compatibility with older firmware versions.

## New Features

### Enhanced Export Functionality

• CSV Export: Added CSV export functionality for logbook entries, providing per-stroke data including elapsed time, distance, pace, power, stroke rate, drive/recovery durations, heart rate, drag factor, peak force, and handle forces.
• Web Share API Integration: Enhanced export functionality to leverage the Web Share API on supported devices, providing a seamless sharing experience on mobile devices with automatic fallback to traditional downloads on desktop.

### Firmware Update Manager

• Automated Firmware Download: Implemented a new auto-versioning tool that automatically downloads firmware assets from GitHub releases during build time, ensuring users always have access to the latest firmware.
• Firmware Profile Selection: Added a new bottom-sheet component for selecting and downloading firmware profiles directly from within the application.
• Progress Tracking: Integrated download progress bar with ZIP extraction capabilities (using fflate library) for a smooth firmware update experience.

### BLE API Updates

• Extended Metrics Support: Updated extended metrics characteristic to support the new 16-bit dragFactor as per ESPRM v7.0.0 BLE API changes, with backward compatibility maintained for 7-byte packets from older firmware.
• Deprecated Settings Handling: Refactored stroke detection settings to handle the deprecation of `minimumRecoverySlopeMargin` field in new firmware while maintaining backward compatibility for legacy firmware versions.
• UUID Standardization: Updated BLE service and characteristic identifiers to use full 128-bit UUID format for improved cross-platform compatibility.

## General Updates and Improvements

### Framework Updates

• Angular v21: Upgraded to Angular v21 from v20, including all related packages (Angular CLI, Material, CDK, compiler, and core modules).
• Vitest Migration: Complete migration of testing infrastructure from Jasmine/Karma to Vitest for both application tests and tools, providing faster test execution and modern testing capabilities.
• Zoneless Testing: Completed zoneless migration for unit tests, removing zone.js dependency and migrating from `fakeAsync` to Vitest's async utilities.

### Performance and Stability

• Stream Optimization: Refactored observables in ErgMetricsService and MetricsService to improve performance by sharing streams and avoiding multiple subscriptions to the same observable.
• Error Handling: Improved error handling across services and components with better feedback mechanisms and more robust error recovery.
• Service Worker Guards: Enhanced service worker integration with guards against environments where the service worker API is not available.
• WebUSB API Guard: Added guards against missing WebUSB API when initializing ANT heart rate service to prevent startup crashes on unsupported platforms.

### UI and UX Enhancements

• Responsive Layout: Refactored media queries to display more cards on iPhones in landscape mode for improved mobile experience.
• Error Display: Fixed app startup crash error message display issues related to Angular custom app-root tag rendering, with improved device detection for iOS.
• Settings Styling: Enhanced GeneralSettingsComponent form-field styling for better layout consistency.

### Build and Development

• Build Scripts: Refactored and improved build and dev scripts in package.json for better clarity and consistency with a new `build:prepare` script.
• ESLint Configuration: Fixed ESLint configuration issues and updated dependencies for improved linting coverage.
• Test Improvements: Migrated test syntax from Jasmine to Vitest conventions and improved test implementations in line with modern best practices.

### Bug Fixes

• Database Error Handling: Added proper error handling for IndexedDB operations when fetching session summaries in the logbook.
• File Download: Fixed file download implementation to properly revoke object URLs after download completion.

## Breaking Changes

• Testing Framework: Projects extending or using the test infrastructure must now use Vitest instead of Jasmine/Karma.
• Removed zone.js: The application no longer depends on zone.js in production, which may affect extensions relying on Zone.js patching.

This release represents a significant modernization effort, with comprehensive test infrastructure updates, enhanced user features for data export and firmware management, and improved architectural foundations that prepare the application for future enhancements.

Full Changelog: [6.2.0...7.0.0](https://github.com/Abasz/ESPRowingMonitor-WebGUI/compare/6.2.0...7.0.0)
