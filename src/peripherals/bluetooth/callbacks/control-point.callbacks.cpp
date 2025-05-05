#include <array>
#include <utility>

#include "ArduinoLog.h"
#include "NimBLEDevice.h"

#include "globals.h"

#include "../bluetooth.controller.h"
#include "./control-point.callbacks.h"

using std::array;

ControlPointCallbacks::ControlPointCallbacks(ISettingsBleService &_settingsBleService, IEEPROMService &_eepromService) : settingsBleService(_settingsBleService), eepromService(_eepromService)
{
}

void ControlPointCallbacks::onWrite(NimBLECharacteristic *const pCharacteristic, NimBLEConnInfo &connInfo)
{
    NimBLEAttValue message = pCharacteristic->getValue();

    Log.verboseln("Incoming connection");

    if (message.size() == 0)
    {
        Log.infoln("Invalid request, no Op Code");
        array<unsigned char, 3U> errorResponse = {
            std::to_underlying(SettingsOpCodes::ResponseCode),
            static_cast<unsigned char>(0),
            std::to_underlying(ResponseOpCodes::OperationFailed)};
        pCharacteristic->setValue(errorResponse);
        pCharacteristic->indicate();

        return;
    }

    Log.infoln("Op Code: %d; Length: %d", message[0], message.size());

    switch (message[0])
    {

    case std::to_underlying(SettingsOpCodes::SetLogLevel):
    {
        Log.infoln("Set LogLevel");

        const auto response = processLogLevel(message, pCharacteristic);

        array<unsigned char, 3U>
            temp = {
                std::to_underlying(SettingsOpCodes::ResponseCode),
                static_cast<unsigned char>(message[0]),
                std::to_underlying(response)};

        pCharacteristic->setValue(temp);
    }
    break;

    case std::to_underlying(SettingsOpCodes::ChangeBleService):
    {
        Log.infoln("Change BLE Service");

        if (message.size() == 2 && message[1] >= 0 && message[1] <= 2)
        {
            processBleServiceChange(message, pCharacteristic);

            return;
        }

        array<unsigned char, 3U> temp = {
            std::to_underlying(SettingsOpCodes::ResponseCode),
            static_cast<unsigned char>(message[0]),
            std::to_underlying(ResponseOpCodes::InvalidParameter)};

        pCharacteristic->setValue(temp);
    }
    break;

    case std::to_underlying(SettingsOpCodes::SetSdCardLogging):
    {
        Log.infoln("Change Sd Card Logging");

        const auto response = processSdCardLogging(message, pCharacteristic);

        array<unsigned char, 3U> temp = {
            std::to_underlying(SettingsOpCodes::ResponseCode),
            static_cast<unsigned char>(message[0]),
            std::to_underlying(response)};

        pCharacteristic->setValue(temp);
    }
    break;

    case std::to_underlying(SettingsOpCodes::SetDeltaTimeLogging):
    {
        Log.infoln("Change deltaTime logging");

        const auto response = processDeltaTimeLogging(message, pCharacteristic);

        array<unsigned char, 3U> temp = {
            std::to_underlying(SettingsOpCodes::ResponseCode),
            static_cast<unsigned char>(message[0]),
            std::to_underlying(response)};

        pCharacteristic->setValue(temp);
    }
    break;

    default:
    {
        Log.infoln("Not Supported Op Code: %d", message[0]);
        array<unsigned char, 3U> response = {
            eepromService.getBleServiceFlag() == BleServiceFlag::FtmsService ? std::to_underlying(SettingsOpCodes::ResponseCodeFtms) : std::to_underlying(SettingsOpCodes::ResponseCode),
            static_cast<unsigned char>(message[0]),
            std::to_underlying(eepromService.getBleServiceFlag() == BleServiceFlag::FtmsService ? ResponseOpCodes::ControlNotPermitted : ResponseOpCodes::UnsupportedOpCode)};
        pCharacteristic->setValue(response);
    }
    break;
    }

    Log.verboseln("Send indicate");
    pCharacteristic->indicate();
}

ResponseOpCodes ControlPointCallbacks::processLogLevel(const NimBLEAttValue &message, NimBLECharacteristic *const pCharacteristic)
{
    if (message.size() != 2 || message[1] < 0 || message[1] > 6)
    {
        return ResponseOpCodes::InvalidParameter;
    }

    Log.infoln("New LogLevel: %d", message[1]);
    eepromService.setLogLevel(ArduinoLogLevel{message[1]});

    settingsBleService.broadcastSettings();

    return ResponseOpCodes::Successful;
}

ResponseOpCodes ControlPointCallbacks::processSdCardLogging(const NimBLEAttValue &message, NimBLECharacteristic *const pCharacteristic)
{
    if (message.size() != 2 || message[1] < 0 || message[1] > 1)
    {
        Log.infoln("Invalid OP command for setting SD Card deltaTime logging, this should be a bool: %d", message[1]);

        return ResponseOpCodes::InvalidParameter;
    }

    const auto shouldEnable = static_cast<bool>(message[1]);
    Log.infoln("%s SdCard logging", shouldEnable ? "Enable" : "Disable");
    eepromService.setLogToSdCard(shouldEnable);

    settingsBleService.broadcastSettings();

    return ResponseOpCodes::Successful;
}

ResponseOpCodes ControlPointCallbacks::processDeltaTimeLogging(const NimBLEAttValue &message, NimBLECharacteristic *const pCharacteristic)
{
    if (message.size() != 2 || message[1] < 0 || message[1] > 1)
    {
        Log.infoln("Invalid OP command for setting deltaTime logging, this should be a bool: %d", message[1]);

        return ResponseOpCodes::InvalidParameter;
    }

    const auto shouldEnable = static_cast<bool>(message[1]);

    Log.infoln("%s deltaTime logging", shouldEnable ? "Enable" : "Disable");
    eepromService.setLogToBluetooth(shouldEnable);

    settingsBleService.broadcastSettings();

    return ResponseOpCodes::Successful;
}

void ControlPointCallbacks::processBleServiceChange(const NimBLEAttValue &message, NimBLECharacteristic *const pCharacteristic)
{
    std::string flagString;
    switch (BleServiceFlag{message[1]})
    {
    case BleServiceFlag::CpsService:
        flagString = "CPS";
        break;

    case BleServiceFlag::CscService:
        flagString = "CSC";
        break;

    case BleServiceFlag::FtmsService:
        flagString = "FTMS";
        break;
    }

    Log.infoln("New BLE Service: %s", flagString.c_str());
    eepromService.setBleServiceFlag(BleServiceFlag{message[1]});
    array<unsigned char, 3U> temp = {
        std::to_underlying(SettingsOpCodes::ResponseCode),
        static_cast<unsigned char>(message[0]),
        std::to_underlying(ResponseOpCodes::Successful)};
    pCharacteristic->setValue(temp);
    pCharacteristic->indicate();

    settingsBleService.broadcastSettings();

    Log.verboseln("Restarting device...");
    restartWithDelay(100);
}