# Version 7.1.0

This release introduces a fully customizable dashboard layout editor, session management improvements including pause/resume support, and a new sliding moving average feature for smoothing displayed metrics and an experimental comprehensive session analysis feature. The update ensures compatibility with ESPRM firmware v7.1.0.

## New Features

### Dashboard Layout Editor

- **Drag-and-Drop Tile Editor:** Implemented a visual tile layout editor with drag-and-drop support, allowing users to arrange dashboard tiles through the settings dialog.
- **Dynamic Tile Rendering:** Replaced hardcoded tile elements with dynamic rendering based on layout configuration, with grid positioning via inline styles.
- **Orientation-Specific Layouts:** Added support for separate landscape and portrait layouts with a preferred screen orientation setting (auto, landscape, portrait) and Screen Orientation API lock when available.
- **Standalone Tile Components:** Refactored dashboard tiles into standalone components that receive data via injected context, enabling dynamic rendering.

### Session Management Enhancements

- **Pause/Resume:** Extended SessionManagerService with pause/resume capability. Users can pause a running session and resume without resetting session data. Any stroke arriving while paused triggers auto-resume.
- **Auto-Start Toggle:** Added an option to disable automatic timer start when a new stroke appears, useful for sessions where manual control of the timer is preferred.
- **Stopwatch Utility:** Added a dedicated Stopwatch utility for high-accuracy elapsed time tracking with start/stop/pause/resume operations, replacing the previous timestamp-based calculation.
- **Reactive Session Pipeline:** Replaced the offset-subtraction approach with a scan-based reactive pipeline that accumulates metrics from incoming differences, providing robust guard against device restart and enabling pause support.

### Metrics Smoothing

- **Sliding Moving Average (SMA):** Added a configurable SMA feature that smooths displayed metric values on the dashboard without affecting recorded data. Users choose between three modes (off, performance, all) and a configurable window size (2–6). The buffer resets when rowing stops.

### New Tiles

- **Speed Tile:** Added a Speed tile displaying current km/h or mph.
- **Peak Force Tile:** Added a Peak Force tile showing peak force from handle forces.
- **Drive Length Tile:** Added a Drive Length metric and corresponding tile.

### Rower Profile Export

- **Settings Export:** Added functionality to export current rowing machine settings as a C++ header file for use when compiling ESPRM firmware, with a dialog for device and model input.

### Session Analysis and Detail View (Experimental)

- **Session Detail Route:** Added a dedicated session detail view at `session/:id` with loading, error, and tabbed states, accessible from the logbook dialog.
- **Session Summary:** Displays session statistics in three sections (Totals, Maximums, Averages) with responsive grid layout and conditional heart rate display.
- **Time-Series Charts:** Added seven interactive time-series charts (Speed, Stroke Power, Stroke Rate, Heart Rate, Dist/Stroke, Drive Length, Drive/Recovery) with average lines, explicit Y-axis bounds, and zoom/pan support via Chart.js and chartjs-plugin-zoom.
- **Stroke Inspector:** Added a strokes tab with per-stroke metric cards, prev/next/slider navigation, continuous force curve chart with current stroke highlighting, and lap markers for quick navigation.
- **Lap Detection:** Automatically detects laps by identifying periods of inactivity exceeding 5 seconds. A clickable lap table integrates with chart zoom to focus on individual laps.
- **Session Switcher:** Added a searchable autocomplete dropdown in the session toolbar to switch between recorded sessions without returning to the dashboard.
- **JSON Import:** Added the ability to import session data from JSON files via the session toolbar, with imported sessions available in the session switcher.

## General Updates and Improvements

### Data and Recording

- **FIT File Export:** Replaced TCX export with FIT file export using the official Garmin FIT SDK. Produces standard Activity files with rowing/indoorRowing sport type, including distance, speed, power, cadence, heart rate, HRV data, and session summaries. Compatible with Strava, Garmin Connect, and other FIT-compatible platforms.
- **Drive Length Persistence:** Added drive length data to the database and exports, with migration to backfill existing records.
- **Elapsed Time Persistence:** Added elapsed time to session data, with DB v3 migration to backfill existing records using timestamp arithmetic.
- **Improved Recording Pipeline:** Reworked data recording to save at least one datapoint per second, capturing heart rate snapshots even during inactivity.
- **Refactored Session Architecture:** Centralized session lifecycle into SessionManagerService, moving session-relative computation out of MetricsService (now a stateless transformer emitting cumulative device totals).
- **Export Interface Refactor:** Consolidated export interfaces into a single `IExportSession` type used by all export paths (JSON, FIT, CSV), including device name and sessionId.

### UI and UX

- **Responsive Layout Improvements:** Added container query-based dynamic font sizing for metric tiles, significantly improving dashboard responsiveness across screen sizes.
- **Native M3 Theming:** Migrated from M2-to-M3 interop approach to native `mat.theme()` mixin emitting `--mat-sys-*` CSS custom properties directly.
- **Settings Dialog Reorganization:** Moved each settings component into its own subfolder and refactored tab handling to use an enum.
- **Slider Improvements:** Improved rowing settings slider interaction on smaller screens with full-width sliders and permanent value labels.

### Database Reliability

- **Migration Safety:** Added a blocking migration overlay with progress indication during database schema upgrades, preventing data loss from user interaction during long-running migrations. Includes WakeLock to prevent device sleep during migration.

### Framework and Dependency Updates

- **Angular 21.2:** Updated Angular and related packages from v21.0 to v21.2.
- **ng2-charts v10:** Updated from v8 to v10.
- **New Dependencies:** Added `@garmin/fitsdk` for FIT file export, `chartjs-plugin-zoom` and `hammerjs` for interactive chart zoom/pan, and `chart.js` for session analysis charts. Removed `js2xmlparser` (previously used for TCX export).

### Bug Fixes

- **Device Name in Logbook:** Fixed a bug where the connected device name was not correctly linked to the session when reset was hit after connection.
- **Session ID Caching:** Fixed caching of sessionId and timeStamp during database writes to avoid race conditions.

### Developer Experience

- **Refactored Test Infrastructure:** Split SettingsDialogComponent tests into multiple files with shared helper functions.
- **Utility Extraction:** Extracted `downloadFiles` into a reusable utility function.

## Breaking Changes

- **Database Schema v3:** The database schema has been updated to v3 to include `driveLength` and `elapsedTime` fields. Migration runs automatically on first load with a blocking progress overlay. Large databases may take several minutes to migrate.

Full Changelog: [7.0.1...7.1.0](https://github.com/Abasz/ESPRowingMonitor-WebGUI/compare/7.0.1...7.1.0)
