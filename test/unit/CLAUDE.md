# Unit Test Conventions

Framework: **Catch2 v3** + **FakeIt** (Catch2 integration). Tests run natively on the host — no hardware required.

## File Naming & Location

- Test file: `<subject>.spec.cpp`, aiming for `test/unit/<subsystem>/` — several existing files (`EEPROM.service.spec.cpp`, `globals.spec.cpp`, `led.service.spec.cpp`, `main.spec.cpp`, `ota-updater.service.spec.cpp`, `peripherals.controller.spec.cpp`, `power-manager.*.spec.cpp`, `sd-card.service.spec.cpp`) sit directly under `test/unit/` without a subsystem folder; match the target for new files even if not every existing file complies.
- Mirrors the production file name: `stroke.controller.cpp` → `test/unit/rower/stroke.controller.spec.cpp`.
- New `*.spec.cpp` files are picked up automatically by CMake glob — no manual registration.
- A shared fixture header for one subsystem (not itself a test) uses `*.spec.h`, e.g. `test/unit/series/regression.test-cases.spec.h`.

## Linting

Rules intentionally violated by test code (magic numbers, cognitive complexity, Catch2/FakeIt-internal patterns like `do-while` macros or `NewDelete`) are suppressed via `test/unit/.clang-tidy` (folder-scoped, `InheritParentConfig: true`), **not** per-file `NOLINTBEGIN`/`NOLINTEND` blocks — no spec file currently carries a file-level NOLINT block. Don't add one for a rule already disabled there; check `test/unit/.clang-tidy` first. Use `// NOLINTNEXTLINE(rule)` only for a genuinely one-off, file-specific suppression not already covered by the folder config.

## Include Order

Each tier blank-line separated and alphabetically sorted within itself; empty tiers are skipped. This order is specific to `test/unit/` — `src/` follows a different order (see root [CLAUDE.md](../../CLAUDE.md)).

1. Standard library headers (angle brackets)
2. `catch2/...` headers, then `fakeit.hpp` last
3. Stub headers from `./include/`, `../include/`, or `../../include/` (Arduino, ESP-IDF, and other hardware stubs — one alphabetical block; many spec files legitimately include stub `Arduino.h`/`NimBLEDevice.h`/`SdFat.h` — that's the sanctioned way to reach hardware APIs in tests, not a violation of "no hardware headers")
4. Stub `globals.h`, if used, as its own block
5. `src/` headers under test (`../../../src/...`, path depth varies by nesting)

```cpp
// test/unit/rower/stroke.controller.spec.cpp
#include <vector>                     // std lib

#include "catch2/catch_test_macros.hpp"  // test frameworks
#include "fakeit.hpp"

#include "../include/Arduino.h"          // stub headers

#include "../../../src/rower/flywheel.service.interface.h"  // src under test
#include "../../../src/rower/stroke.controller.h"
```

## `TEST_CASE` Naming

```cpp
TEST_CASE("StrokeController", "[rower]")
```

- Name: aim for the **class under test**, spelled exactly as the class name — though not every existing TEST_CASE follows this (a few use a prose description or a "ClassName methodName" hybrid instead).
- Tag: aim for the subdirectory / domain (e.g. `[rower]`, `[utils]`, `[ble-service]`, `[callbacks]`, `[peripheral]`). Real tags in use today are more varied than a strict subdirectory mapping (`[ble-service]`, `[callbacks]`, `[peripheral]`, `[regression]`, `[utils]`, `[rower]`, `[ota]`, `[main]`, `[globals]`), and a handful of TEST_CASEs have no tag at all — match the target for new tests, don't assume every existing one is tagged.

## `SECTION` Naming

Human-readable sentences that describe behaviour, not implementation, Shouldly style grouped SECTION (groups could correspond to when... or if...):

```cpp
SECTION("should return zero distance when no strokes have been detected") { ... }
SECTION("if new data is available")
{
    SECTION("should get flywheel data") { ... }
    SECTION("should process new flywheel data") { ... }
}
```

When testing methods always use a nested SECTION for it, with `should` kept on the **same line** as the method-name SECTION — never as its own nested SECTION:

```cpp
// Correct — "should" stays with the method name
SECTION("update method should")
{
    SECTION("do something") { ... }
}

// Wrong — "should" split onto the child SECTION
SECTION("update method")
{
    SECTION("should do something") { ... }
}
```

**One behaviour per test — split on "and".** If a `SECTION` name needs "and" to describe what it verifies, it's most probably testing more than one thing; split it into sibling sections instead of asserting both behaviours in one:

```cpp
// Wrong — two behaviours joined by "and"
SECTION("begin method should")
{
    SECTION("setup FlywheelService and StrokeService") { ... }
}

// Correct — split into one SECTION per behaviour
SECTION("begin method should")
{
    SECTION("setup FlywheelService") { ... }
    SECTION("setup StrokeService") { ... }
}
```

## Mock Setup (FakeIt)

Aim for this ordering for mock setup readability (existing files don't all follow it exactly, especially the last point — treat it as the target, not a hard rule):

1. Reset external/global mocks (no blank lines between resets)
2. **Blank line**
3. Declare all local `Mock<T>` instances (no blank lines between declarations)
4. **Blank line**
5. Setup calls grouped by mock dependency (use blank lines between logical groups). Within a group, `Fake()` and `When()` interleave in whatever order matches how the SUT calls them — there is no fixed Fake-before-When or When-before-Fake rule in this codebase.
6. **Blank line**
7. Construct the subject under test (SUT), generally after mock setup — though some files construct it right after declaring mocks and set up stubs afterward.

**Example with simple mocks:**

```cpp
using namespace fakeit;

// Declare mocks (no blanks between them)
Mock<IStrokeService>   mockStrokeService;
Mock<IFlywheelService> mockFlywheelService;
Mock<IEEPROMService>   mockEEPROMService;

// Setup, interleaved in whatever order the SUT actually calls them
Fake(Method(mockFlywheelService, setup));

When(Method(mockEEPROMService, getMachineSettings))
    .Return(RowerProfile::MachineSettings{});
When(Method(mockEEPROMService, getSensorSignalSettings))
    .Return(RowerProfile::SensorSignalSettings{});

// Construct SUT — named after the class under test, not "sut"
// (no spec file in this repo actually uses a variable literally named `sut`)
StrokeController strokeController(
    mockStrokeService.get(),
    mockFlywheelService.get(),
    mockEEPROMService.get());
```

**Example with external mocks being reset:**

```cpp
// Reset external mocks first (no blanks)
mockSdFat32.Reset();
mockFile32.Reset();
mockArduino.Reset();

// Blank line, then local mocks
Mock<IEEPROMService> mockEEPROMService;

// Blank line, then setup grouped by mock dependency
// Group 1: SdFat32 setup
Fake(Method(mockSdFat32, end));

// Group 2: File32 setup
When(Method(mockFile32, isOpen)).AlwaysReturn(true);
When(Method(mockFile32, close)).AlwaysReturn(true);
Fake(Method(mockFile32, println));
Fake(Method(mockFile32, flush));

// Group 3: Arduino setup (separate if unrelated)
When(Method(mockArduino, xTaskCreatePinnedToCore)).AlwaysReturn(1);
Fake(Method(mockArduino, vTaskDelete));

// Construct SUT
SdCardService sdCardService;
```

### TEST_CASE-level shared mock defaults

When **every** section in a `TEST_CASE` requires the same mock reset and default stubs, place the `Reset()` and `AlwaysReturn` calls at the top of `TEST_CASE` body (before any `SECTION`). Catch2 re-enters the `TEST_CASE` body for each leaf section, so each section gets a fresh reset automatically. Individual sections then only need to override the calls that differ:

```cpp
TEST_CASE("RotaryEncoderService", "[ui]")
{
    mockArduino.Reset();

    // Shared defaults — every section gets these unless overridden below
    When(Method(mockArduino, millis)).AlwaysReturn(0UL);
    When(Method(mockArduino, digitalRead).Using(DefaultConfigurations::clockPin)).AlwaysReturn(HIGH);
    When(Method(mockArduino, digitalRead).Using(DefaultConfigurations::dataPin)).AlwaysReturn(HIGH);

    SECTION("handleRotation method should")
    {
        SECTION("report Increment after one full CW detent")
        {
            // Override pin sequences for this specific scenario
            When(Method(mockArduino, digitalRead).Using(DefaultConfigurations::clockPin))
                .Return(HIGH, HIGH, LOW, LOW, HIGH);
            When(Method(mockArduino, digitalRead).Using(DefaultConfigurations::dataPin))
                .Return(HIGH, LOW, LOW, HIGH, HIGH);

            RotaryEncoderService rotaryEncoderService;
            for (auto i = 0; i < 5; ++i)
                rotaryEncoderService.handleRotation();

            REQUIRE(rotaryEncoderService.getStatus() == EncoderState::Increment);
        }
    }
}
```

**`Fake` vs `When`:**

- `Fake(Method(...))` — for void-return methods that don't need a return value specified
- `When(Method(...)).Return(...)` — for methods with return values
- Use blank lines to separate logical mock dependency groups

## Mocking Arduino & Free-Standing Functions

Arduino APIs and other free-standing functions (like `millis()`, `micros()`, `pinMode()`, `xTaskCreatePinnedToCore()`, etc.) cannot be injected as class dependencies. Instead, they are mocked via **stub headers** in `test/unit/include/`.

### How It Works

Each stub header (e.g., `test/unit/include/Arduino.h`) contains:

1. **An interface class** (e.g., `MockArduino`) with pure-virtual methods:

```cpp
// test/unit/include/Arduino.h
class MockArduino
{
protected:
    ~MockArduino() = default;
public:
    virtual unsigned long millis() = 0;
    virtual unsigned long micros() = 0;
    virtual void pinMode(unsigned char pin, unsigned char mode) = 0;
    virtual BaseType_t xTaskCreatePinnedToCore(...) = 0;
    // ... other methods
};
```

1. **An extern mock instance**:

```cpp
extern fakeit::Mock<MockArduino> mockArduino;
```

1. **Free-standing inline functions** that delegate to the mock:

```cpp
inline unsigned long millis()
{
    return mockArduino.get().millis();
}

inline unsigned long micros()
{
    return mockArduino.get().micros();
}

inline void pinMode(unsigned char pin, unsigned char mode)
{
    mockArduino.get().pinMode(pin, mode);
}
```

### Using in Tests

When the production code calls `millis()` or `pinMode()`, it automatically calls through the mock. Set up behaviour:

```cpp
using namespace fakeit;

// Before each test section, reset the mock:
mockArduino.Reset();

// Stub return values:
When(Method(mockArduino, millis)).Return(1'000'000UL);
When(Method(mockArduino, micros)).AlwaysReturn(2'000'000UL);

// Stub void functions:
Fake(Method(mockArduino, pinMode));
Fake(Method(mockArduino, digitalWrite));

// Verify calls were made with expected arguments:
Verify(Method(mockArduino, pinMode).Using(Eq(GPIO_NUM_4), Eq(INPUT_PULLUP))).Once();
Verify(Method(mockArduino, xTaskCreatePinnedToCore).Using(
    Ne(nullptr),              // task function pointer (not null)
    StrEq("saveDeltaTimeTask"), // task name
    Eq(2'048U),               // stack size
    Ne(nullptr),              // parameters (not null)
    Eq(1U),                   // priority
    Any(),                    // task handle
    Eq(0)                     // core ID
)).Once();
```

### Multiple Mock Instances

Some stubs define multiple mocks (e.g., `SdFat.h` has both `mockSdFat32` and `mockFile32`). Reset all relevant mocks before each test section:

```cpp
mockArduino.Reset();
mockSdFat32.Reset();
mockFile32.Reset();

When(Method(mockArduino, xTaskCreatePinnedToCore)).AlwaysReturn(1);
When(Method(mockSdFat32, begin)).AlwaysReturn(true);
Fake(Method(mockFile32, close));
```

## Arrange / Act / Assert Structure

- All mocks are **created inline** inside the `SECTION` — no shared mock state across sibling sections.
- Use **nested `SECTION`** to share an Arrange+Act block and then split on different assertions:

```cpp
SECTION("if new data is available")
{
    // Arrange
    Mock<IFlywheelService> mockFlywheelService;
    When(Method(mockFlywheelService, hasDataChanged)).Return(true);
    When(Method(mockFlywheelService, getData)).Return({ .rawImpulseCount = 2, ... });
    StrokeController strokeController(...);

    strokeController.update();  // Act — shared for all nested sections

    SECTION("should get flywheel data")
    {
        Verify(Method(mockFlywheelService, getData)).Once();
    }

    SECTION("should call processData on StrokeService")
    {
        Verify(Method(mockStrokeService, processData)).Once();
    }
}
```

Not every spec follows the "mocks + SUT construction inline per-SECTION" rule strictly — e.g. `test/unit/bluetooth/ble-services/battery.service.spec.cpp` declares its mocks, stubs, and constructs the SUT once at `TEST_CASE` body level, shared by every sibling `SECTION`. Prefer the inline-per-`SECTION` form for new tests; treat the shared form as an existing, accepted variant rather than something to replicate by default.

## Interaction Assertions

```cpp
Verify(Method(mockService, methodName)).Once();
Verify(Method(mockService, methodName)).Exactly(3);
Verify(Method(mockService, methodName)).Exactly(0);   // assert not called
VerifyNoOtherInvocations(mockService);                 // no unexpected calls
```

## Value Assertions

Prefer `CHECK` (non-fatal, continues after failure) for multiple related assertions in one section, and `REQUIRE` (fatal, stops on failure) for preconditions and single critical assertions. In practice `REQUIRE`/`REQUIRE_THAT` are the de-facto default across the codebase by roughly 10:1 over `CHECK`/`CHECK_THAT`, including in some multi-assertion sections — treat the `CHECK`-for-multiple-related-assertions guidance as the improvement to reach for in new tests, not a description of most existing code:

```cpp
// Multiple related — use CHECK:
CHECK(metrics.strokeCount == 11);
CHECK(metrics.lastStrokeTime == 26'217'932ULL);
CHECK(metrics.driveDuration > 0U);

// Single or precondition — use REQUIRE:
REQUIRE(deltaTimesStream.good());
REQUIRE(metrics.strokeCount == 10);
```

## Floating-Point Comparisons

Prefer `Catch::Matchers::WithinRel` over `==` on floats/doubles for new tests. This is not applied consistently today: `test/unit/series/ts-linear-series.spec.cpp` and `ts-quadratic-series.spec.cpp` compare `Configurations::precision` values with `==` at many sites, while `cyclic-error-filter.spec.cpp`, `exponential-weighted-average.spec.cpp`, `stroke.service.spec.cpp`, `ols-linear-series.spec.cpp`, `series.spec.cpp`, and `weighted-average-series.spec.cpp` do use `WithinRel`. Use `WithinRel` for any new floating-point assertion regardless of what the surrounding file currently does:

```cpp
CHECK_THAT(metrics.distance,
    Catch::Matchers::WithinRel(9'230.747896923, 0.0000001));

REQUIRE_THAT(result, Catch::Matchers::WithinRel(expectedValue, 1e-7));
```

## Hardware-Independent Tests

Tests run natively on Linux/macOS. The stub headers in `test/unit/include/` replace all Arduino/ESP32 APIs. Rules:

- Do **not** include the *real* Arduino/ESP32 headers in a spec file — including the stub headers from `test/unit/include/` (e.g. `"./include/Arduino.h"`, `"../include/NimBLEDevice.h"`, `"../../include/SdFat.h"`) is the normal, expected way many spec files reach these APIs; see the Include Order stub-header tier above.
- Do **not** call `delay()`, `millis()`, `attachInterrupt()`, or any hardware function directly — call through the stub, which routes to the mock.
- All hardware-touching code lives behind an `IInterface` that is mocked in tests.

## Test Settings

The `UNIT_TEST` compile flag routes all settings includes to `test/unit/include/test.settings.h`, a flat set of `#define`s applied before `macros.h`'s defaults (not `#undef` + `#define` pairs — the file has no `#undef` directives). When a test needs a specific setting value, edit the `#define` directly in that file; the one redefinition case (`BOARD_PROFILE`) is suppressed with `// NOLINTNEXTLINE(clang-diagnostic-macro-redefined)` rather than an `#undef`:

```cpp
// test.settings.h
#define BAUD_RATE BaudRates::Baud115200
```

Never hard-code setting values in test files — reference the `RowerProfile::Defaults` or `Configurations` constants instead.

## Replay-Based Integration Tests

For physics-accuracy tests, read delta-time (and related) data from `.txt` files in the subject's own `test-data/` subfolder — there is no single shared `test/unit/test-data/` directory:

```cpp
std::ifstream deltaTimesStream("test/unit/rower/test-data/stroke.service.spec.deltaTimes.txt");
REQUIRE(deltaTimesStream.good());

std::vector<unsigned long> deltaTimes;
unsigned long value = 0;
while (deltaTimesStream >> value) { deltaTimes.push_back(value); }
REQUIRE(!deltaTimes.empty());

// Feed each delta-time into the service under test, then assert final metrics.
```

## Run Tests

```sh
cmake --build build --target run-unit-test --parallel 4
```
