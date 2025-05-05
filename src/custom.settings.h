#pragma once

#include BOARD_PROFILE
#include ROWER_PROFILE

#include "./utils/enums.h"

// NOLINTBEGIN(cppcoreguidelines-macro-usage)

#define DEFAULT_CPS_LOGGING_LEVEL ArduinoLogLevel::LogLevelTrace
#define DEFAULT_BLE_SERVICE BleServiceFlag::CpsService
#define ENABLE_BLUETOOTH_DELTA_TIME_LOGGING true

#undef BAUD_RATE
#define BAUD_RATE BaudRates::Baud1500000

// NOLINTEND(cppcoreguidelines-macro-usage)