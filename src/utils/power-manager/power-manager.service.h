#pragma once

#include "./power-manager.service.interface.h"

class PowerManagerService final : public IPowerManagerService
{
    [[nodiscard]] unsigned char setupBatteryMeasurement() const;
    static void printWakeupReason();
    static void powerSensorOn();

public:
    [[nodiscard]] unsigned char setup() const override;
    void goToSleep() const override;
    [[nodiscard]] unsigned char measureBattery() const override;
};