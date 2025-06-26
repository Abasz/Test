#include <array>
#include <bit>
#include <utility>

#include "ArduinoLog.h"

#include "../../../utils/configuration.h"
#include "../../../utils/enums.h"
#include "../ble-metrics.model.h"
#include "./settings.service.h"
#include "settings.service.h"

SettingsBleService::SettingsBleService(ISdCardService &_sdCardService, IEEPROMService &_eepromService) : sdCardService(_sdCardService), eepromService(_eepromService), callbacks(*this, _eepromService)
{
}

NimBLEService *SettingsBleService::setup(NimBLEServer *const server)
{
    Log.traceln("Setting up Settings Service");
    auto *settingsService = server->createService(CommonBleFlags::settingsServiceUuid);
    characteristic = settingsService->createCharacteristic(CommonBleFlags::settingsUuid, NIMBLE_PROPERTY::NOTIFY | NIMBLE_PROPERTY::READ);

    characteristic->setValue(getSettings());

    settingsService->createCharacteristic(CommonBleFlags::settingsControlPointUuid, NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::INDICATE)->setCallbacks(&callbacks);

    return settingsService;
}

void SettingsBleService::broadcastSettings() const
{
    ASSERT_SETUP_CALLED(characteristic);

    characteristic->setValue(getSettings());
    characteristic->notify();
}

std::array<unsigned char, ISettingsBleService::settingsPayloadSize> SettingsBleService::getSettings() const
{
    const unsigned char baseSettings =
        ((Configurations::enableBluetoothDeltaTimeLogging ? static_cast<unsigned char>(eepromService.getLogToBluetooth()) + 1 : 0) << 0U) |
        ((Configurations::supportSdCardLogging && sdCardService.isLogFileOpen() ? static_cast<unsigned char>(eepromService.getLogToSdCard()) + 1 : 0) << 2U) |
        (std::to_underlying(eepromService.getLogLevel()) << 4U) |
        (static_cast<unsigned char>(Configurations::isRuntimeSettingsEnabled) << 7U);

    const auto machineSettings = eepromService.getMachineSettings();

    const auto flywheelInertia = std::bit_cast<unsigned int>(machineSettings.flywheelInertia);

    std::array<unsigned char, ISettingsBleService::settingsPayloadSize>
        temp = {
            baseSettings,
            static_cast<unsigned char>(flywheelInertia),
            static_cast<unsigned char>(flywheelInertia >> 8),
            static_cast<unsigned char>(flywheelInertia >> 16),
            static_cast<unsigned char>(flywheelInertia >> 24),
            static_cast<unsigned char>(roundf(machineSettings.concept2MagicNumber * ISettingsBleService::magicNumberScale)),
        };

    return temp;
}