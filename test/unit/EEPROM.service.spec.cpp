// NOLINTBEGIN(readability-magic-numbers)
#include <utility>

#include "catch2/catch_test_macros.hpp"
#include "fakeit.hpp"

#include "./include/Preferences.h"

#include "../../src/utils/EEPROM/EEPROM.service.h"

using namespace fakeit;

TEST_CASE("EEPROMService", "[utils]")
{
    const auto *const logLevelAddress = "logLevel";
    const auto *const bleServiceAddress = "bleService";
    const auto *const bluetoothDeltaTimeLoggingAddress = "bleLogging";
    const auto *const sdCardLoggingAddress = "sdCardLogging";
    const auto *const flywheelInertiaAddress = "flywheelInertia";
    const auto *const concept2MagicNumberAddress = "magicNumber";

    SECTION("setup method")
    {
        Mock<Preferences> mockPreferences;

        When(Method(mockPreferences, begin)).Return(true);
        When(Method(mockPreferences, freeEntries)).Return(100);
        When(Method(mockPreferences, isKey)).AlwaysReturn(false);

        When(Method(mockPreferences, putUChar)).AlwaysReturn(1);
        When(Method(mockPreferences, putBool)).AlwaysReturn(1);
        When(Method(mockPreferences, putFloat)).AlwaysReturn(1.0F);

        When(Method(mockPreferences, getBool).Using(StrEq(bluetoothDeltaTimeLoggingAddress), Configurations::enableBluetoothDeltaTimeLogging)).Return(Configurations::enableBluetoothDeltaTimeLogging);
        When(Method(mockPreferences, getBool).Using(StrEq(sdCardLoggingAddress), false)).Return(false);
        When(Method(mockPreferences, getUChar).Using(StrEq(logLevelAddress), std::to_underlying(Configurations::defaultLogLevel))).Return(std::to_underlying(Configurations::defaultLogLevel));
        When(Method(mockPreferences, getUChar).Using(StrEq(bleServiceAddress), std::to_underlying(Configurations::defaultBleServiceFlag))).Return(std::to_underlying(Configurations::defaultBleServiceFlag));
        When(Method(mockPreferences, getFloat).Using(StrEq(flywheelInertiaAddress), Configurations::flywheelInertia)).Return(Configurations::flywheelInertia);
        When(Method(mockPreferences, getFloat).Using(StrEq(concept2MagicNumberAddress), Configurations::concept2MagicNumber)).Return(Configurations::concept2MagicNumber);

        EEPROMService eepromService(mockPreferences.get());
        eepromService.setup();

        SECTION("should start EEPROM")
        {
            Verify(Method(mockPreferences, begin)).Once();
        }

        SECTION("should initialize keys to their defaults if do not exist")
        {
            Verify(Method(mockPreferences, isKey).Using(StrEq(logLevelAddress))).Once();
            Verify(Method(mockPreferences, putUChar).Using(StrEq(logLevelAddress), std::to_underlying(Configurations::defaultLogLevel))).Once();

            Verify(Method(mockPreferences, isKey).Using(StrEq(bleServiceAddress))).Once();
            Verify(Method(mockPreferences, putUChar).Using(StrEq(bleServiceAddress), std::to_underlying(Configurations::defaultBleServiceFlag))).Once();

            Verify(Method(mockPreferences, isKey).Using(StrEq(bluetoothDeltaTimeLoggingAddress))).Once();
            Verify(Method(mockPreferences, putBool).Using(StrEq(bluetoothDeltaTimeLoggingAddress), Configurations::enableBluetoothDeltaTimeLogging)).Once();

            Verify(Method(mockPreferences, isKey).Using(StrEq(sdCardLoggingAddress))).Once();
            Verify(Method(mockPreferences, putBool).Using(StrEq(sdCardLoggingAddress), false)).Once();

            Verify(Method(mockPreferences, isKey).Using(StrEq(flywheelInertiaAddress))).Once();
            Verify(Method(mockPreferences, putFloat).Using(StrEq(flywheelInertiaAddress), Configurations::flywheelInertia)).Once();

            Verify(Method(mockPreferences, isKey).Using(StrEq(concept2MagicNumberAddress))).Once();
            Verify(Method(mockPreferences, putFloat).Using(StrEq(concept2MagicNumberAddress), Configurations::concept2MagicNumber)).Once();
        }

        SECTION("should get keys from EEPROM")
        {
            Verify(Method(mockPreferences, getBool).Using(StrEq(bluetoothDeltaTimeLoggingAddress), Configurations::enableBluetoothDeltaTimeLogging)).Once();

            Verify(Method(mockPreferences, getBool).Using(StrEq(sdCardLoggingAddress), false)).Once();

            Verify(Method(mockPreferences, getUChar).Using(StrEq(logLevelAddress), std::to_underlying(Configurations::defaultLogLevel))).Once();

            Verify(Method(mockPreferences, getUChar).Using(StrEq(bleServiceAddress), std::to_underlying(Configurations::defaultBleServiceFlag))).Once();

            Verify(Method(mockPreferences, getFloat).Using(StrEq(flywheelInertiaAddress), Configurations::flywheelInertia)).Once();

            Verify(Method(mockPreferences, getFloat).Using(StrEq(concept2MagicNumberAddress), Configurations::concept2MagicNumber)).Once();
        }

        SECTION("should set initial values for getters")
        {
            REQUIRE(eepromService.getBleServiceFlag() == Configurations::defaultBleServiceFlag);
            REQUIRE(eepromService.getLogLevel() == Configurations::defaultLogLevel);
            REQUIRE(eepromService.getLogToBluetooth() == Configurations::enableBluetoothDeltaTimeLogging);
            REQUIRE(eepromService.getLogToSdCard() == false);
        }
    }

    SECTION("setLogLevel method")
    {
        Mock<Preferences> mockPreferences;
        When(Method(mockPreferences, putUChar)).AlwaysReturn(1);
        const auto newLogLevel = ArduinoLogLevel::LogLevelVerbose;

        EEPROMService eepromService(mockPreferences.get());

        SECTION("should set and save new log level")
        {
            eepromService.setLogLevel(newLogLevel);

            REQUIRE(eepromService.getLogLevel() == newLogLevel);
            Verify(Method(mockPreferences, putUChar).Using(StrEq(logLevelAddress), std::to_underlying(newLogLevel))).Once();
        }

        SECTION("should ignore invalid level")
        {
            mockPreferences.ClearInvocationHistory();

            eepromService.setLogLevel(ArduinoLogLevel{7});

            Verify(Method(mockPreferences, putUChar)).Exactly(0);
        }
    }

    SECTION("setLogToBluetooth method should set and save new log to bluetooth flag")
    {
        Mock<Preferences> mockPreferences;
        When(Method(mockPreferences, putBool)).AlwaysReturn(1);
        EEPROMService eepromService(mockPreferences.get());
        const auto newLogToBluetooth = !eepromService.getLogToBluetooth();

        eepromService.setLogToBluetooth(newLogToBluetooth);

        REQUIRE(eepromService.getLogToBluetooth() == newLogToBluetooth);
        Verify(Method(mockPreferences, putBool).Using(StrEq(bluetoothDeltaTimeLoggingAddress), newLogToBluetooth)).Once();
    }

    SECTION("setLogToSdCard method should set and save new log to SdCard flag")
    {
        Mock<Preferences> mockPreferences;
        When(Method(mockPreferences, putBool)).AlwaysReturn(1);
        EEPROMService eepromService(mockPreferences.get());
        const auto newLogToSdCard = !eepromService.getLogToSdCard();

        eepromService.setLogToSdCard(newLogToSdCard);

        REQUIRE(eepromService.getLogToSdCard() == newLogToSdCard);
        Verify(Method(mockPreferences, putBool).Using(StrEq(sdCardLoggingAddress), newLogToSdCard)).Once();
    }

    SECTION("setBleServiceFlag method")
    {
        Mock<Preferences> mockPreferences;
        When(Method(mockPreferences, putUChar)).AlwaysReturn(1);
        const auto bleService = BleServiceFlag::CscService;

        EEPROMService eepromService(mockPreferences.get());

        SECTION("should set and save new log level")
        {
            eepromService.setBleServiceFlag(bleService);

            REQUIRE(eepromService.getBleServiceFlag() == bleService);
            Verify(Method(mockPreferences, putUChar).Using(StrEq(bleServiceAddress), std::to_underlying(bleService))).Once();
        }

        SECTION("should ignore invalid flag")
        {
            mockPreferences.ClearInvocationHistory();

            eepromService.setBleServiceFlag(BleServiceFlag{7});

            Verify(Method(mockPreferences, putUChar)).Exactly(0);
        }
    }

    SECTION("setMachineSettings method should")
    {
        Mock<Preferences> mockPreferences;
        When(Method(mockPreferences, putFloat)).AlwaysReturn(1);
        EEPROMService eepromService(mockPreferences.get());

        SECTION("not save if any value is invalid")
        {
            const auto invalidFlywheel = RowerProfile::MachineSettings{
                .flywheelInertia = -1,
                .concept2MagicNumber = 1,
            };

            const auto invalidMagicNumber = RowerProfile::MachineSettings{
                .flywheelInertia = 1,
                .concept2MagicNumber = -1,
            };

            eepromService.setMachineSettings(invalidFlywheel);
            Verify(Method(mockPreferences, putFloat).Using(StrEq(flywheelInertiaAddress), invalidFlywheel.flywheelInertia)).Never();
            Verify(Method(mockPreferences, putFloat).Using(StrEq(concept2MagicNumberAddress), invalidMagicNumber.concept2MagicNumber)).Never();

            eepromService.setMachineSettings(invalidMagicNumber);
            Verify(Method(mockPreferences, putFloat).Using(StrEq(concept2MagicNumberAddress), invalidMagicNumber.concept2MagicNumber)).Never();
            Verify(Method(mockPreferences, putFloat).Using(StrEq(concept2MagicNumberAddress), invalidMagicNumber.concept2MagicNumber)).Never();
        }

        SECTION("save new machine settings")
        {
            const auto newMachineSettings = RowerProfile::MachineSettings{
                .flywheelInertia = 1,
                .concept2MagicNumber = 1,
            };

            eepromService.setMachineSettings(newMachineSettings);

            const auto machineSettings = eepromService.getMachineSettings();

            Verify(Method(mockPreferences, putFloat).Using(StrEq(flywheelInertiaAddress), newMachineSettings.flywheelInertia)).Once();
            Verify(Method(mockPreferences, putFloat).Using(StrEq(concept2MagicNumberAddress), newMachineSettings.concept2MagicNumber)).Once();
            REQUIRE(machineSettings.flywheelInertia != newMachineSettings.flywheelInertia);
            REQUIRE(machineSettings.concept2MagicNumber != newMachineSettings.flywheelInertia);
        }
    }
}
// NOLINTEND(readability-magic-numbers)