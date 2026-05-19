# ESP Rowing Monitor — Dual-Flywheel Variant
## High-Level Feature Specification

**Version:** 1.2  
**Status:** Final for Discussion  
**Scope:** Standalone firmware for ergometers with two independent flywheels (one per oar). Forked from ESP Rowing Monitor (ESPRM). Shares the physics engine and scaffolding; maintained independently. Upstream changes may be selectively ported.

---

## 1. Background and Motivation

A third-party ergometer manufacturer requires firmware for a dual-flywheel rowing machine where each oar drives an independent flywheel. This firmware is a standalone fork of ESPRM. It does not maintain backwards compatibility with single-flywheel ESPRM profiles or BLE service layouts. The codebase is written exclusively for the dual-flywheel use case.

### Physical Model and Assumptions

- **Independent flywheels**: Each oar is mechanically connected to one flywheel via a dedicated gearbox and sprocket. The two flywheels are electrically and mechanically isolated.
- **Hall-effect sensors**: Each flywheel is instrumented with a Hall-effect sensor mounted on the frame, triggering 1–6 times per wheel revolution (manufacturer decision; 6 is recommended for highest resolution). Both ESP32 units are connected via GPIO to their respective flywheel sensors. The impulse count per revolution is set at compile time in the board profile.
- **Physics model**: Each flywheel represents *half* the boat's hydrodynamic resistance. The physics engine (inherited from ESPRM, calibrated against Concept2 rowing ergometer) applies independently to each side, allowing asymmetric rowing to be captured accurately in per-oar metrics.
- **Combined metrics**: Combined power, distance, and pace are derived by summing per-side contributions. Combined stroke rate uses `std::max` to avoid underreporting if one side has missed a stroke detection event.
- **Session semantics**: Each ESP32 maintains cumulative distance and stroke count from session start; the primary unit derives per-stroke deltas and combines both sides at the `MetricManagerController` layer.
- **`lastRevTime` semantics**: `lastRevTime` exposed by `StrokeController` (and transmitted in the UART packet) represents `rowingTotalTime` at the moment of the last flywheel impulse — an accumulated microsecond counter from session start, not a wall-clock timestamp. Per-oar speed derivation uses the *difference* between consecutive `lastRevTime` values from the same source, so inter-unit clock skew has no effect on accuracy.
- **`Configurations::precision`**: Internally, distance and power are computed as `double`. The UART packet carries both as `float32` (explicit cast in `SerialTxService`). Precision loss is not material: at 10,000m cumulative distance, `float32` retains sub-millimetre resolution, which exceeds the inherent accuracy of the physics model.

---

## 2. Architecture Overview

Two ESP32 units are used, one per flywheel, physically connected via UART. Each runs a firmware variant determined at compile time.

- **Secondary unit**: full stroke detection and physics. Transmits a per-stroke summary to the primary via UART. Exposes Extended Metrics BLE custom service only.
- **Primary unit**: full stroke detection and physics. Receives secondary summary via UART. Combines both sides via `MetricManagerController` and broadcasts via FTMS Rower and its own Extended Metrics service. Supports two simultaneous BLE connections.

### Connection Topology

```text
┌───────────────────┐       UART        ┌──────────────────────────────────────┐
│  Secondary ESP32  │── TX→RX ─────────▶│  Primary ESP32                       │
│  (e.g. right oar) │                   │  (e.g. left oar)                     │
│                   │                   │                                      │
│  StrokeController │                   │  StrokeController                    │
│  SerialTxService  │                   │  SerialRxService                     │
│                   │                   │  MetricManagerController             │
│  Extended Metrics │                   │  FTMS Rower profile                  │
│  BLE (custom)     │                   │  Extended Metrics BLE (custom)       │
└───────────────────┘                   └──────────────────────────────────────┘
         │ BLE                                           │ BLE (2 connections)
         ▼                                              ├─────────────────▶ Watch (FTMS)
    Mobile App ◀──────────────────────────────────────── └─────────────────▶ Mobile App
  (per-oar Extended data)                              (FTMS combined +
                                                        Extended Metrics)
```

### Client Data Summary

| Metric | Watch (FTMS) | Mobile App via FTMS | Mobile App — Extended Primary | Mobile App — Extended Secondary |
| --- | --- | --- | --- | --- |
| Combined power | ✓ | ✓ | | |
| Combined distance | ✓ | ✓ | | |
| Combined pace / speed | ✓ | ✓ | | |
| Combined stroke rate | ✓ | ✓ | | |
| Per-oar average power | | | ✓ | ✓ |
| Per-oar drive duration | | | ✓ | ✓ |
| Per-oar recovery duration | | | ✓ | ✓ |
| Per-oar handle forces | | | ✓ | ✓ |
| Per-oar drag factor | | | ✓ | ✓ |

---

## 3. Build System and Firmware Variants

A single codebase is maintained for both roles. The active role is set at compile time.

### Role Definition

```cpp
enum class DualFlywheelRole : uint8_t { Primary, Secondary };
constexpr DualFlywheelRole kFlywheelRole = DualFlywheelRole::Primary; // set per build
```

Role-specific code paths use `if constexpr`:

```cpp
if constexpr (kFlywheelRole == DualFlywheelRole::Primary) {
    // primary-only initialisation
}
```

Preprocessor `#if` is used only where required (conditional includes, class declarations that cannot be dead-code-eliminated by `if constexpr`).

### PlatformIO Environments

```ini
[env:dual_primary]
build_flags = -DDUAL_FLYWHEEL_ROLE=0   ; Primary

[env:dual_secondary]
build_flags = -DDUAL_FLYWHEEL_ROLE=1   ; Secondary
```

The `constexpr` role value is derived from the preprocessor flag:

```cpp
constexpr DualFlywheelRole kFlywheelRole =
    static_cast<DualFlywheelRole>(DUAL_FLYWHEEL_ROLE);
```

Unit tests (CMake) parameterise the same flag, producing two test binaries — one per role.

### Compile-Time Configuration

- **`ENABLE_RUNTIME_SETTINGS` is `false`** for both roles. All machine parameters (flywheel inertia, sprocket radius, impulse count, drag factor thresholds, stroke detection settings) are fixed at compile time via the board and rower profiles. The settings BLE service is retained as a read-only interface; no runtime writes are processed.
- **BLE service flag**: CSC and Power Meter profiles are removed. FTMS is hardcoded for the primary role. The EEPROM scaffolding for the service flag is retained without modification to reduce fork divergence and preserve the option to re-enable profile selection in a future variant. On the primary, the EEPROM flag is ignored; FTMS is initialised unconditionally.
- **SD card logging**: SD card delta time logging code is retained but disabled via the board profile (`sdCardChipSelectPin = GPIO_NUM_NC`). No code removal is required.
- **BLE delta time logging**: Retained and active on both units. Enables BLE-based raw delta time streaming used by the calibration helper during Phase 4.

---

## 4. UART Communication Protocol

### Physical Setup

- Primary and secondary connected (e.g. by cable or soldered on a PCB): Secondary TX → Primary RX, shared GND.
- Both units powered from the same source.
- Baud rate: 115200.
- Secondary: TX only (data). Primary: RX only (data). Unidirectional data channel.
- Primary drives secondary hardware enable pin via a dedicated GPIO (see Section 4.3).

### Hardware Assignment (ESP32-S3 targets)

| Interface | Use |
| --- | --- |
| USB CDC (`Serial`) | Debug logging and serial monitor — native USB, no bridge chip |
| UART1 (`Serial1`, physical GPIO pins) | Inter-ESP UART communication |

On ESP32-S3 dev boards (Lolin S3 Mini, Waveshare S3 Zero), USB CDC and UART1 are fully independent. No conflict with the serial monitor. UART1 RX/TX GPIO assignments are set per board profile; specific pin numbers confirmed during integration testing.

### 4.1 Stroke Packet Format

Transmission occurs once per completed stroke. The secondary main loop detects a new `strokeCount` and triggers transmission — mirroring the same condition used in upstream ESPRM to trigger BLE notification.

```text
┌──────────┬──────────────────────────────┬──────────┐
│ Start    │ Payload (26 bytes, fixed)    │ Checksum │
│ 0xA5 (1B)│                              │ XOR (1B) │
└──────────┴──────────────────────────────┴──────────┘
Total: 28 bytes per stroke packet
```

**Checksum:** XOR of all payload bytes. Receiver accumulates XOR as payload bytes arrive; no full-packet buffering needed before validation. Detects single-byte corruption and most multi-byte errors over a short cable.

**Framing and receive timeout:** `SerialRxService` implements a three-state machine to handle both payload bytes that happen to equal a start byte value and packets truncated mid-transmission (e.g. secondary reset or glitch):

```text
SEEKING_START   → wait indefinitely for 0xA5 or 0xAA
READING_PAYLOAD → read exactly N bytes; each byte fetched from the FreeRTOS queue
                  with xQueueReceive(..., SERIAL_RX_BYTE_TIMEOUT_MS ticks);
                  if timeout fires before all bytes arrive → discard, return to SEEKING_START
VALIDATING      → verify XOR checksum; process if valid, log and discard if not;
                  always return to SEEKING_START
```

While in `READING_PAYLOAD`, the receiver is counting bytes — it never inspects their value for start bytes. A payload byte equal to `0xA5` or `0xAA` is therefore harmless. `SERIAL_RX_BYTE_TIMEOUT_MS` is a compile-time constant (suggested default: 50ms). At 115200 baud a full 28-byte packet transmits in approximately 2.4ms, so 50ms provides ample margin for inter-byte jitter while being orders of magnitude shorter than the minimum inter-stroke interval.

### Payload Fields

| Field | Type | Bytes | Notes |
| --- | --- | --- | --- |
| `strokeCount` | uint16 | 2 | Matches `RowingMetrics.strokeCount` type; max 65,535 strokes is sufficient for any session |
| `avgStrokePower` | float32 | 4 | Cast from `double`; precision loss not material for watt-level display |
| `cumulativeDistance` | float32 | 4 | Cast from `double`; metres since session start; primary diffs against previous received value to obtain per-stroke delta |
| `lastStrokeTime` | uint64 | 8 | Microseconds (`rowingTotalTime` at stroke completion), for combined stroke rate |
| `lastRevTime` | uint64 | 8 | Microseconds (`rowingTotalTime` at last flywheel impulse), for per-oar speed derivation |

All values little-endian. Total payload: 26 bytes.

`lastRevTime` mirrors the role of the "last wheel event time" field in the CSC and CPS BLE profiles. The primary diffs consecutive `lastRevTime` values alongside the cumulative distance delta to derive per-oar speed.

**Speed Derivation:**

```text
distanceDelta = cumulativeDistance_current − cumulativeDistance_previous
ΔlastRevTime  = lastRevTime_current − lastRevTime_previous
v_oar         = distanceDelta / (ΔlastRevTime × 1e-6)   [result in m/s]
```

The division by 1e-6 converts microseconds to seconds. The same derivation applies to the primary side using `StrokeController` data directly.

### 4.2 Startup Handshake

On initialisation the secondary transmits a single 3-byte handshake packet before entering normal operation:

```text
┌──────────┬──────────────┬──────────┐
│ Start    │ Version      │ Checksum │
│ 0xAA (1B)│ uint8 (1B)   │ XOR (1B) │
└──────────┴──────────────┴──────────┘
Total: 3 bytes
```

The primary cycles the secondary enable pin (`SECONDARY_EN_PIN`) low then high during its own startup to guarantee the secondary boots in a known state. The primary then listens on UART1 for a valid handshake packet within `HANDSHAKE_TIMEOUT_MS` (compile-time constant in board profile; suggested default: 5000 ms).

If the handshake is not received within the timeout, the primary cycles the secondary enable pin low then high again and retries. After three failed attempts: red LED, halt (manual power cycle required).

**Version handling:** The handshake version field is reserved for future protocol revisions. Version mismatch handling is not included in the current scope (deferred to future versions).

### 4.3 Secondary Enable Pin Control (Primary Side)

The primary drives the secondary's hardware enable (`EN`) pin via a dedicated GPIO (`SECONDARY_EN_PIN`, defined in the dual-flywheel board profile). On startup, the primary asserts this pin HIGH after cycling it low→high to ensure a clean reset. The same cycling mechanism is used in the handshake retry sequence (Section 4.2). Because the secondary always restarts cleanly alongside the primary, `cumulativeDistance` and `strokeCount` on both units are always session-aligned from boot.

---

## 5. MetricManagerController

### Overview

`MetricManagerController` sits between the stroke detection layer and the BLE broadcast layer on the primary unit only. It holds two data slots (primary and secondary), a flush timer, and the accumulated combined session state. It is the single point responsible for producing all FTMS output.

The primary's own Extended Metrics BLE service is fed directly by `StrokeController` via the existing `PeripheralsController` path (unchanged from upstream ESPRM), broadcasting primary-side per-oar detail metrics independently of the combiner.

### Main Loop Integration

Both roles share a single `main.cpp` with one `setup()` and one `loop()`. Role-specific behaviour is gated by `if constexpr` blocks, consistent with the rest of the codebase. Shared logic (stroke controller update, impulse logging, BLE keepalive) runs unconditionally; role-specific services (serial TX/RX, `MetricManagerController`, EN pin management) are compiled in only for the relevant role.

**Power management note:** The secondary does not use `PowerManagerController`. Its power state is controlled exclusively by the primary via the EN pin — hardware-guaranteed off when the pin is driven low, with no risk of spurious wake. Firmware-managed deep sleep on the secondary would conflict with EN pin authority and adds complexity for no benefit. `PowerManagerController` is therefore excluded from the secondary build via `if constexpr`. Battery monitoring remains on the primary only, as in upstream ESPRM.

**Shared `setup()` (pseudocode):**

```text
setup:
  Serial.begin(...)         // USB CDC debug
  eepromService.setup()

  if constexpr (Secondary):
    serialTxService.sendHandshake()

  if constexpr (Primary):
    cycle EN pin (secondary reset)
    serialRxService.waitForHandshake()   // retries on timeout; halt on persistent failure
    metricManagerController.begin()

  strokeController.begin()
  peripheralController.begin()          // Primary: FTMS + Extended Metrics
                                        // Secondary: Extended Metrics only
  if constexpr (Primary):
    powerManagerController.begin()
```

**Shared `loop()` (pseudocode):**

```text
loop:
  if otaService.isUpdating(): return

  strokeController.update()

  if constexpr (Primary):
    serialRxService.update()            // on valid packet:
                                        //   metricManagerController.onSecondaryStroke(packet)

  if constexpr (Primary):
    peripheralController.update(powerManagerController.getBatteryLevel())
    powerManagerController.update(strokeController.getLastImpulseTime(),
                                  peripheralController.isAnyDeviceConnected())
  if constexpr (Secondary):
    peripheralController.update(0)      // no battery level on secondary

  if new raw impulse:
    peripheralController.updateDeltaTime(deltaTime)   // BLE delta time logging (both roles)

  if strokeController.strokeCount != prevStrokeCount:
    if constexpr (Secondary):
      serialTxService.send(strokeController.getAllData())

    if constexpr (Primary):
      metricManagerController.onPrimaryStroke(strokeController.getAllData())
      peripheralController.updateData(strokeController.getAllData())   // Extended Metrics

    prevStrokeCount = strokeController.strokeCount

  if constexpr (Primary):
    metricManagerController.update()    // timeout check; flushes if expired

    // Periodic re-broadcast of last combined result (4s keepalive):
    if now - lastCombinedBroadcastTime > minBleUpdateInterval:
      peripheralController.updateCombinedData(metricManagerController.getLastCombined())
      lastCombinedBroadcastTime = now

    if powerManagerController.getBatteryLevel() != powerManagerController.getPreviousBatteryLevel():
      peripheralController.notifyBattery(powerManagerController.getBatteryLevel())
      powerManagerController.setPreviousBatteryLevel()
```

### Slot and Flush Logic

`MetricManagerController` maintains:

- `primarySlot`: `optional<RowingMetrics>` — filled on each new primary stroke
- `secondarySlot`: `optional<SecondaryPacket>` — filled when a valid UART packet arrives
- `primarySlotFilledAt`: timestamp (ms) — set when primary slot is filled
- `lastCombined`: most recent combined output, used for periodic re-broadcast
- Persistent state carried between flushes: `prevDistancePrimary`, `prevDistanceSecondary`, `prevLastRevTimePrimary`, `prevLastRevTimeSecondary`, `prevLastStrokeTimePrimary`, `prevLastStrokeTimeSecondary`, `accumulatedDistance`

**`onPrimaryStroke(data)`:**

- Fill `primarySlot = data`
- Record `primarySlotFilledAt = millis()`

**`onSecondaryStroke(packet)`:**

- Fill `secondarySlot = packet`
- If `primarySlot` is filled and not yet flushed: call `flush()` immediately

**`update()` (called every loop):**

- If `primarySlot` is filled, not yet flushed, and `millis() - primarySlotFilledAt > COMBINER_TIMEOUT_MS`: call `flush()`

**`flush()`:**

1. Compute combined metrics from `primarySlot` (and `secondarySlot` if available — see combination rules)
2. Update all persistent prev values
3. Accumulate distance: `accumulatedDistance += distanceDelta_primary + distanceDelta_secondary`
4. Store result in `lastCombined`
5. Emit to FTMS via `peripheralController.updateCombinedData(lastCombined)`
6. Clear `primarySlot`; reset flush flag

`getLastCombined()` returns `lastCombined` for the periodic keepalive broadcast without triggering new combination logic.

### Combination Rules

| FTMS Field | Rule | Detail |
| --- | --- | --- |
| `instantaneous_power` | Sum | `P_primary + P_secondary` |
| `average_power` | Rolling average | Average of combined power over recent strokes |
| `total_distance` | Cumulative sum | `accumulatedDistance += distanceDelta_primary + distanceDelta_secondary` |
| `instantaneous_pace` | From combined speed | `v_total = v_primary + v_secondary`; pace per FTMS Rower profile specification |
| `stroke_rate` | `std::max` of per-side rates | `rate_oar = 60e6 / (lastStrokeTime_oar − prevLastStrokeTime_oar)`; `stroke_rate = std::max(rate_primary, rate_secondary)` |
| `stroke_count` | `std::max` | `std::max(strokeCount_primary, strokeCount_secondary)` |
| `elapsed_time` | Primary | `rowingTotalTime` from primary `StrokeController` |

**Per-oar speed:**

```text
distanceDelta_primary   = primaryData.distance           − prevDistancePrimary
distanceDelta_secondary = secondaryPacket.cumulativeDistance − prevDistanceSecondary
ΔrevTime_primary        = primaryData.lastRevTime        − prevLastRevTimePrimary
ΔrevTime_secondary      = secondaryPacket.lastRevTime    − prevLastRevTimeSecondary
v_primary   = distanceDelta_primary   / (ΔrevTime_primary   × 1e-6)   [m/s]
v_secondary = distanceDelta_secondary / (ΔrevTime_secondary × 1e-6)   [m/s]
v_total     = v_primary + v_secondary
```

**Stroke rate:** Each side maintains its own `prevLastStrokeTime`. `rate_oar = 60e6 / (lastStrokeTime_oar − prevLastStrokeTime_oar)`. Combined = `std::max(rate_primary, rate_secondary)`. `uint64` throughout — no overflow concern.

**Graceful degradation:** If `secondarySlot` is empty at flush time, `distanceDelta_secondary = 0`, `v_secondary = 0`, and `P_secondary = 0`. The combined result reflects primary-only data for that stroke. `prevDistanceSecondary` and `prevLastRevTimeSecondary` are not updated on a degraded flush, so the next flush that includes secondary data computes the delta correctly over the longer interval. `stroke_rate` and `stroke_count` fall back to primary values only.

### SerialRxService (Primary Side)

- Hardware UART1 with interrupt-driven RX into a FreeRTOS queue; non-blocking.
- Implements the three-state framing machine described in Section 4.1 (`SEEKING_START → READING_PAYLOAD → VALIDATING`), including the per-byte `xQueueReceive` timeout for truncation recovery.
- Start byte value (`0xA5` vs `0xAA`) determines expected payload length; the correct byte count is read before checksum validation.
- Invalid packets (checksum mismatch or byte timeout) are discarded and logged; receiver returns immediately to `SEEKING_START`.
- Valid stroke packets are forwarded to `MetricManagerController.onSecondaryStroke()`.

---

## 6. BLE

### Profiles

| Profile | Unit | Notes |
| --- | --- | --- |
| FTMS Rower | Primary only | Standard profile; combined metrics from `MetricManagerController` |
| Extended Metrics (custom) | Both | Per-oar detail metrics; unchanged from upstream ESPRM |
| Settings service | Both | Inherited unchanged; effectively read-only (`ENABLE_RUNTIME_SETTINGS = false`) |
| OTA service | Both | Unchanged |
| Battery service | Primary only | Unchanged from upstream ESPRM; conditional on `batteryPinNumber != GPIO_NUM_NC` |

CSC and Power Meter profiles are not implemented. FTMS is hardcoded on the primary; the BLE service flag in EEPROM is not acted upon, but the EEPROM schema is retained unchanged.

### Advertisement

- Secondary: advertises Extended Metrics UUID only. Invisible to watches and standard ergometer apps scanning for FTMS.
- Primary: advertises FTMS UUID. Discoverable by standard clients (watches, EXR, ErgZone).
- Device names: `Rower` / `Rower-Secondary` — fixed at compile time via board profile constant.
- Primary supports two simultaneous BLE connections (watch + mobile app). No changes to connection limit handling required.

---

## 7. Degraded Operation

| Condition | Behaviour |
| --- | --- |
| Secondary not responding at startup | Primary retries EN pin cycle up to 3 times; on persistent failure: red LED, halt (manual power cycle required) |
| Secondary packet fails checksum | Packet discarded and logged; `MetricManagerController` proceeds without secondary data at next flush |
| Secondary data not received within timeout | `MetricManagerController` flushes with primary-only data for that stroke; `prevDistanceSecondary` and `prevLastRevTimeSecondary` not updated until next valid secondary packet |
| Non-consecutive `strokeCount` received | Gap logged; latest packet used; no reconstruction attempted |

Because the EN pin cycle at startup guarantees both units boot fresh together, mid-session secondary reboot is not a supported scenario. Hardware-level serial failures are outside firmware scope.

---

## 8. What is Retained Unchanged from Upstream ESPRM

- `StrokeController` — full stroke detection and physics engine
- `CyclicErrorFilter` and all series utilities
- Extended Metrics BLE custom service
- Settings service (read-only in this variant) and OTA service
- Board profiles
- SD card delta time logging code (present in fork; disabled via `sdCardChipSelectPin = GPIO_NUM_NC` in board profile)
- BLE delta time logging (active on both units; used during Phase 4 calibration)

---

## 9. Out of Scope

- Per-oar split display or asymmetry analysis in any client application
- Derived metric calculation client-side (e.g. drive distance, peak force from Extended Metrics payload) — a derivation specification can be provided on request
- Wireless inter-ESP communication
- CSC or Power Meter BLE profiles
- Android/iOS mobile app development (consultation-type support only)
- Hardware design, PCB layout, cable and connector specifications, mechanical integration (manufacturer responsibility; breadboard prototype firmware only, excluding sensors)

---

## 10. Implementation Phases

### Phase 1 — Core Development

- Codebase fork and removal of CSC, Power Meter, multi-profile switching
- Compile-time role system (`constexpr` + PlatformIO environments); `ENABLE_RUNTIME_SETTINGS = false` enforced in dual-flywheel board profile; FTMS hardcoded on primary
- Dual-flywheel board profile (board-agnostic; UART1, EN pin constants, impulses-per-revolution)
- `SerialTxService` on secondary: stroke packet serialisation (uint16 strokeCount, float32 casts, uint64 timestamps), XOR checksum, startup handshake, UART1 TX; triggered by `strokeCount` change in secondary main loop
- `SerialRxService` on primary: interrupt-driven RX, start-byte framing, XOR validation, FreeRTOS queue, forwarding to `MetricManagerController`
- Secondary EN pin management and startup handshake sequence on primary
- LED error feedback on startup failure and packet errors
- `MetricManagerController`: slot/flush/timeout logic, combination rules, per-oar speed derivation, stroke rate from timestamp delta, graceful degradation; exposes `getLastCombined()` for periodic keepalive
- Dual-flywheel main loop variants for both roles
- FTMS Rower profile integration driven by `MetricManagerController` output
- BLE advertisement changes (both units)
- Unit tests for combiner logic and serial framing (both role compilations)

### Phase 2 — Integration and Bug Fixing

- Two-board bench integration: UART communication, packet framing, XOR behaviour
- `MetricManagerController` behaviour under simulated asymmetric timing and stroke count mismatches
- BLE connectivity testing: FTMS with target applications (EXR, ErgZone)
- Extended Metrics verification on Android (once completed by Mobile App Developer)
- Degraded mode testing (secondary unplugged, packet corruption simulation)

### Phase 3 — MVP Delivery

- Firmware binaries for primary and secondary roles
- Basic calibration documentation for the manufacturer
- Known issues and limitations documented
- Delivery of a pre-flashed working breadboard prototype of the connected ESP32 pair (no sensors or mechanical integration; firmware only)

### Phase 4 — Real-World Testing (partially done remotely)

- On-machine rowing calibration: drag factor, distance, pace accuracy vs reference (BLE delta time streaming used for raw data capture if on-site access is unavailable)
- Asymmetric rowing validation: per-oar power and force curves via Extended Metrics
- Combined FTMS metric accuracy at target stroke rates
- Extended session stability (BLE connection stability, UART under continuous use)

### Phase 5 — Mobile App Development Support (Parallel from Phase 3)

- Specification support for mobile app team: Extended Metrics parsing for per-oar display, provision of BLE specification
- Integration support during app development (limited to consultation; not app development itself)
- Joint testing sessions as required

---

## 11. Testing Notes

### Unit Testing

PlatformIO + CMake test targets parameterised by role flag. Two binaries per test suite. Combiner logic, framing, and XOR checksum are testable without hardware. `StrokeController` tests inherited from upstream ESPRM.

### Hardware Communication Testing

On ESP32-S3 targets: USB CDC used for serial monitor, UART1 for inter-ESP. These are independent interfaces — no conflict. A single-board loopback test (UART1 TX wired to UART1 RX) can validate framing and XOR before two-board integration.

### BLE Testing

FTMS validation against target applications (EXR, ErgZone) on Android. Extended Metrics validation requires a BLE client capable of parsing the custom service (mobile app prototype).

---

## 12. Open Questions for Client

1. **Flywheel characteristics** *(required before Phase 1 calibration)*
   - Sprocket radius (mm) — left and right
   - Flywheel moment of inertia (kg·m²) — left and right

   These are required for the physics engine and will determine drag factor accuracy.

2. **Number of magnets per flywheel** — How many magnets are fitted to each flywheel? (1–6 per revolution; 6 is recommended for best accuracy.) Must be confirmed before physics calibration.

3. **Target board model** — Which ESP32-S3 board will be used in production? UART1 RX/TX and EN pin GPIO assignments are board-specific and set in the board profile.

4. **EN pin accessibility** — The firmware requires the primary to drive the secondary's hardware enable pin for automatic restart. Please confirm this pin is exposed in the intended hardware layout.

5. **Bluetooth device names** — Default names are `Rower` (primary) and `Rower-Secondary`. Confirm or supply product-specific names.

6. **Combiner timeout window** — The default 200ms window is a compile-time constant. Should this match a specific asymmetry tolerance, or does the manufacturer require it to be user-adjustable at runtime?

7. **Phase 4 logistics** — Will on-machine access be available for calibration, or will the manufacturer supply raw sensor data via BLE delta time streaming for remote calibration?

---

## 13. Preliminary Effort Estimate

| Phase / Work Item | Low | High |
| --- | --- | --- |
| **Phase 1 — Core Development** | | |
| Fork + profile removal + build system | 3h | 4h |
| `SerialTxService` (secondary, incl. handshake) | 2h | 3h |
| `SerialRxService` (primary, async RX) | 3h | 4h |
| EN pin management + startup handshake sequence | 1h | 2h |
| `MetricManagerController` (slot/flush/timeout + combination rules) | 6h | 8h |
| Dual-flywheel main loop variants (both roles) | 1h | 2h |
| FTMS profile integration | 3h | 4h |
| BLE advertisement changes | 1h | 2h |
| Unit tests (both role compilations) | 4h | 6h |
| **Phase 1 subtotal** | **24h** | **35h** |
| **Phase 2 — Integration and Bug Fixing** | | |
| Bench integration + protocol testing | 5h | 10h |
| BLE connectivity (apps + troubleshooting) | 4h | 8h |
| Degraded mode and edge case testing | 3h | 5h |
| **Phase 2 subtotal** | **12h** | **23h** |
| **Phase 3 — MVP Delivery** | 1h | 2h |
| **Phase 4 — Real-World Testing** | 6h | 12h |
| **Phase 5 — App Dev Support** | 2h | 4h |
| **Total** | **45h** | **76h** |

### Estimate Rationale

- **Phase 1**: Core coding tasks are tightly scoped given codebase familiarity. `MetricManagerController` and the dual main loop variants are the novelty items; a separate line has been added for the main loop refactoring to reflect the architectural integration work explicitly.
- **Phase 2**: Wide range reflects UART timing behaviour and BLE stack interactions visible only on real hardware.
- **Phase 4**: Wide range due to dependency on machine access. BLE delta time streaming reduces the lower bound by enabling remote calibration.
- **Phase 5**: Capped at support/consultation; app development is not in scope.

Closing open question 1 (flywheel characteristics) and question 7 (Phase 4 logistics) before finalising is recommended; these are the two largest variables in the overall estimate.

---

## Internal Notes and TODOs (Not Shared with Client)

### Implementation Details

- **FreeRTOS RX queue depth**: Not yet specified; 2–4 entries are sufficient for normal rowing cadence. Confirm during implementation and document in code comments.
- **`MetricManagerController` initialisation**: On first flush, all `prev*` values are zero. This is correct — `cumulativeDistance` and `lastRevTime` both start from zero in `StrokeService`, so first-stroke deltas are computed correctly without any special-case handling.
- **Settings per unit**: `ENABLE_RUNTIME_SETTINGS = false` means all parameters are compile-time. Both units must be flashed with matching machine parameters. Document in calibration guide.

### Testing Gaps

- **EMI/RFI**: Dual UART + dual Hall sensors + BLE in close proximity. Verify noise coupling does not affect UART framing during bench integration.
- **BLE concurrency**: Verify two simultaneous BLE connections on the primary do not interfere with UART RX interrupt priority on the same unit.

### Future Enhancements (v2)

- **Per-oar asymmetry metrics**: Power balance (left/right ratio as percentage) is derivable now from already-exposed per-oar power values. Drive timing offset (catch timing asymmetry) requires inter-unit clock synchronisation — a one-time sync packet from primary to secondary at startup would enable it and is a natural v2 addition.
- **Version mismatch handling**: Define primary behaviour when handshake version field does not match (e.g. error LED + halt, proceed with warning log, fallback to primary-only).
- **Runtime combiner timeout**: Make `COMBINER_TIMEOUT_MS` user-configurable via settings service if the manufacturer requires field adjustment without reflashing.

---

*This document is the final specification for discussion. Contents, scope boundaries, and estimates are based on current project understanding and are subject to revision following client review and confirmation of open questions.*
