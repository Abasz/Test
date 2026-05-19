# Dual-Flywheel Rowing Machine Firmware - DRAFT FOR DISCUSSION PURPOSES ONLY

## Functional Specification — Client Version

**Version:** 1.0  
**Status:** Final for Client Review  
**Prepared for:** [Manufacturer Name]

---

## 1. Product Overview

This document describes the firmware for a dual-flywheel rowing machine where each oar drives an independent flywheel. The firmware runs on two small microcontrollers (ESP32-S3) installed in the machine — one per flywheel. The two units communicate with each other over a short wired connection and together present a single, unified rowing session to any connected Bluetooth device.

The system is a standalone product based on the open-source ESP Rowing Monitor (ESPRM) physics engine, adapted and extended for the dual-flywheel configuration.

> **Note on inherited features:** Most non-metric capabilities of the upstream ESPRM are carried over unchanged. The settings service and over-the-air (OTA) firmware update service are available on both units. This document describes only the capabilities that are new or different in the dual-flywheel variant.

---

## 2. What the System Measures

Each flywheel is instrumented with a magnetic sensor that detects wheel rotation. From this signal, the firmware independently calculates:

- Power output (watts)
- Cumulative distance
- Stroke rate (strokes per minute)
- Drive and recovery phase duration per stroke
- Handle force curve throughout the pull phase
- Drag factor (an indicator of machine resistance)

These per-side measurements are combined by the primary unit into unified metrics representing the full rowing session.

---

## 3. Connected Devices

### Supported Bluetooth Clients

| Device | Metrics received | Protocol |
| --- | --- | --- |
| Smartwatch / GPS computer | Combined power, pace, distance, stroke rate | Standard FTMS Rower |
| Training app (e.g. EXR, ErgZone) | Combined power, pace, distance, stroke rate | Standard FTMS Rower |
| Mobile app — primary unit | Combined + per-oar detail metrics | FTMS + custom Bluetooth service |
| Mobile app — secondary unit | Per-oar detail metrics (one side) | Custom Bluetooth service |

**Smartwatch compatibility note:** Compatibility depends on the watch model and manufacturer. The firmware uses the standard FTMS (Fitness Machine Service) Rower profile, which is supported by many modern devices. Before finalising the design, the manufacturer should verify compatibility with the specific target watch models.

The primary unit supports two simultaneous Bluetooth connections (e.g. a watch and a phone at the same time).

---

## 4. Metrics Broadcast

### Combined Metrics — Available to All Bluetooth Clients (FTMS standard)

| Metric | Description |
| --- | --- |
| Power | Total output: left + right flywheel power (watts) |
| Pace | Speed expressed as time per 500 metres |
| Distance | Total distance rowed since session start (metres) |
| Stroke rate | Strokes per minute; uses the faster of the two sides to avoid underreporting if one side misses a detection event |
| Elapsed time | Time from device start |

### Per-Oar Metrics — Mobile App Only (via Extended BLE Metrics custom service)

| Metric | Description |
| --- | --- |
| Average power | Average watts for that stroke, per side |
| Drive duration | Duration of the pull phase per stroke, per side (milliseconds) |
| Recovery duration | Duration of the return phase per stroke, per side (milliseconds) |
| Handle force curve | Force profile sampled throughout the pull phase, per side |
| Drag factor | Resistance estimate for each flywheel independently |

Note: other metrics like drive distance, peak force, and other derived quantities can be calculated on the client side from the standard metrics. The firmware would not include these, but upon request a specification on what derived metrics can be calculated can be prepared.

---

## 5. Hardware Requirements

| Item | Quantity | Notes |
| --- | --- | --- |
| ESP32-S3 microcontroller | 2 | One per flywheel (specific board model to be confirmed with manufacturer) |
| Hall-effect sensor | 2 | One per flywheel; triggers on each magnet pass |
| Magnets per flywheel | TBD | 1–6 per revolution; 6 recommended for highest resolution |
| Power supply | Shared | Both units powered from the same source |

The performed work does not include hardware design, sensor selection, or mechanical installation. These are the manufacturer's responsibility.

The firmware developer will deliver two pre-flashed microcontrollers connected breadboard-style (i.e. without sensors or mechanical assembly) at the end of Phase 3 for testing.

---

## 6. What is Included

- Firmware for both primary and secondary units (single codebase, two build configurations)
- All stroke detection, physics calculations, and Bluetooth broadcast logic
- Standard FTMS Rower Bluetooth profile (combined metrics)
- Extended Metrics Bluetooth custom service (per-oar detail metrics)
- Settings service and over-the-air (OTA) firmware update service — available on both units, inherited from upstream ESPRM
- Startup handshake with automatic secondary restart (up to 3 attempts); red LED and halt on persistent failure requiring manual power cycle
- Graceful degradation: corrupted or late packets from the secondary are handled transparently; combined metrics fall back to primary-side data for that stroke
- Unit tests and integration test procedures
- Delivery of two pre-flashed ESP32 units (without sensors, cables, or enclosure)
- Basic calibration guide for the manufacturer

---

## 7. What is Excluded

- Hardware design, PCB layout, or mechanical integration
- Sensor selection or installation
- Android or iOS mobile application development (consultation support only — see Phase 5)
- Cycling Speed & Cadence (CSC) or Power Meter Bluetooth profiles
- Wireless communication between units (wired only)
- Per-oar asymmetry analysis or split-screen display in any client application

---

## 8. Delivery Phases

### Phase 1 — Core Development

All firmware components built and unit-tested on developer hardware. No physical rowing machine required at this stage.

**Included work:** UART serial protocol, left/right metric combination logic, Bluetooth advertisement, startup handshake, LED error indicators, unit tests.

### Phase 2 — Integration and Bug Fixing

Two-board bench testing. Bluetooth connectivity verified with EXR and ErgZone. Degraded-mode scenarios tested (e.g. secondary disconnected mid-session).

### Phase 3 — MVP Delivery

Final firmware binaries, calibration guide, and pre-flashed breadboard prototype delivered to manufacturer.

### Phase 4 — Real-World Testing *(partially remote)*

On-machine validation: drag factor, distance, and pace accuracy checked against a reference. Remote-first approach if on-site access is not available (manufacturer supplies raw sensor data files).

### Phase 5 — Mobile App Development Support *(runs in parallel from Phase 3)*

Bluetooth specification documentation and consultation provided to the manufacturer's mobile app developer. Joint testing sessions as required. **App development itself is not in scope.**

---

## 9. Preliminary Effort Estimate

| Phase | Low | High |
| --- | --- | --- |
| Phase 1 — Core Development | 23h | 33h |
| Phase 2 — Integration and Bug Fixing | 12h | 23h |
| Phase 3 — MVP Delivery | 1h | 2h |
| Phase 4 — Real-World Testing | 6h | 12h |
| Phase 5 — App Dev Support | 2h | 4h |
| **Total** | **44h** | **74h** |

**About the ranges:**

- Phase 1 is well-scoped; the range reflects uncertainty in the development of the metric combinator and the UART communication which dominates Phase 1 effort uncertainty.
- Phase 2 carries a wider range because behaviour on real hardware often reveals integration issues not visible in testing.
- Phase 4 carries the widest range, as it depends on machine access and real rowing conditions. The high end assumes remote-only calibration with iterative data exchange.
- Phase 5 is capped at support and consultation time; mobile app development is not included.

---

## 10. Open Questions

The following must be resolved before work begins (or early in Phase 1):

1. **Flywheel physical parameters** *(required for calibration)*
   - Sprocket radius (mm) — left and right
   - Flywheel moment of inertia (kg·m²) — left and right

2. **Number of magnets per flywheel** — How many magnets are fitted to each flywheel? (1–6 per revolution; 6 is recommended for best accuracy.)

3. **Target hardware** — Which ESP32-S3 board model will be used in the machine? This determines the specific wiring assignments for the data cable and hardware control pin.

4. **Hardware enable pin access** — The firmware requires the primary unit to directly control a hardware enable pin on the secondary unit for automatic restart. Please confirm this pin is exposed in the board layout.

5. **Bluetooth device names** — The default names are `Rower` (primary) and `Rower-Secondary`. Should these match the product name?

6. **Timing tolerance** — The system waits up to 200ms for the secondary stroke data before producing a combined result. Is this tolerance acceptable, or should it be adjustable by the user?

7. **Phase 4 testing logistics** — Will the developer have access to the rowing machine on-site, or will calibration be done remotely using data files provided by the manufacturer?

---

*This document serves as a high-level overview of the firmware scope, behaviour, and delivery plan. It forms the basis for the detailed Technical Specification, which contains the full implementation details.*
