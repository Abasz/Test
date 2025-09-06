# Version 6.2.0 - GPT mini

This release focuses on adding rower settings capabilities implemented on the monitor (including rowing machine profile management), comprehensive test coverage, and modernization of the application architecture. The new profile management feature allow users to load standard rowing profiles and create custom configurations, along with substantial improvements to the settings dialog and overall code quality.

## New Features

### Adding Rower Settings Management

- **Ergometer Configuration**: Added functionality to interact with the new runtime-configurable settings API that allows editing settings directly to the connected ergometer device via BLE.
- **Redesigned Settings Dialog**: Split the settings dialog into separate "General" and "Rowing" sections for improved organization and independent editing capabilities.
- **Settings Validation**: Added user prompts when attempting to close settings without saving changes, preventing accidental loss of configurations.
- **Backward Compatibility**: Implemented support for devices running older firmware versions that don't support settings broadcasting.

### Rowing Profile Management

- **Standard Profile Support**: Added automatic fetching and parsing of standard rowing profiles from the ESPRowingMonitor repository, allowing users to select from pre-configured rowing machine profiles.
- **Custom Profile Management**: Implemented custom profile support with automatic persistence to browser local storage. Custom profiles are automatically saved when users modify settings from standard configurations.
- **Profile Auto-Update**: Integrated automated build pipeline to fetch updated profiles when new firmware releases are available from the ESPRowingMonitor repository.

## General Updates and Improvements

### Code Quality and Testing

- **Comprehensive Test Coverage**: Added extensive unit tests for multiple components and services
- **Improved Testability**: Enhanced service architecture to improve testability, particularly for AntHeartRateService and subscription handling.

### Architecture Modernization

- **Zoneless Change Detection**: Started migration towards zoneless change detection by removing zone.js dependencies from production code and modernizing unit test infrastructure.
- **Component Refactoring**: Moved settings bar buttons into separate, focused components for better modularity and maintainability.
- **Lazy Loading**: Implemented routing with lazy loading for the DashboardComponent to improve initial load performance and provide easier extensibility with new features in the future
- **Code Organization**: Restructured dashboard-related components into organized folders in preparation for future GUI extensions.

### User Experience Enhancements

- **Animation Improvements**: Updated animations for Angular v20 compatibility, including fixes for reduced motion preferences and restoration of Material error animations. Transitioned from deprecated animation APIs to CSS-based animations.
- **Error Handling**: Added comprehensive global error overlay for application startup errors, with specific guidance for iOS users where Web Bluetooth is not supported.
- **API Availability Checks**: Improved native API availability checking with better error handling and user feedback for missing browser APIs.
- **UI Safety**: Added safeguards against multiple setting submissions to prevent accidental double-click issues.

### Framework Updates

- **Angular v20**: Updated to the latest Angular v20 version, including Angular CLI, compiler, and related packages with the newest ESLint configuration.
- **Improved Responsiveness**: Added flex-layout helper classes and mixins to enhance responsive design capabilities across different screen sizes.

### Bug Fixes and Optimizations

- **Promise Handling**: Fixed withDelay utility to correctly handle Promise rejections from passed-in promises.
- **Heart Rate Display**: Fixed styling issues with heart rate button component when heart rate monitoring is disabled.
- **Event Handling**: Improved event and subscription handling using RxJS operators for better performance and reliability.
- **Settings Interface**: Refactored IRowerSettings interface to reflect the new structure separating general and rowing-specific settings.

## Developer Experience

- **Enhanced Tooling**: Added unit-test instruction files for GitHub Copilot integration and updated debugger configurations for improved unit test debugging capabilities.
- **Code Standards**: Updated ESLint rules to remove overly restrictive alphabetical ordering requirements while maintaining code quality standards.
- **Documentation**: Improved inline documentation and code comments for better maintainability.

This release represents a significant step forward in application maturity, with comprehensive test coverage, enhanced user features, and improved architectural foundations that prepare the application for future enhancements.

Full Changelog: [6.0.1...6.2.0](https://github.com/Abasz/ESPRowingMonitor-WebGUI/compare/6.0.1...6.2.0)
