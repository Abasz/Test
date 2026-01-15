#pragma once

#include <vector>

#include "NimBLEDevice.h"

#include "../../../utils/configuration.h"
#include "../ble-services/extended-metrics.service.interface.h"

class SubscriptionManagerCallbacks final : public NimBLECharacteristicCallbacks
{
    std::vector<unsigned char> clientIds;

public:
    SubscriptionManagerCallbacks();

    void onSubscribe(NimBLECharacteristic *pCharacteristic, NimBLEConnInfo &connInfo, unsigned short subValue) override;

    [[nodiscard]] const vector<unsigned char> &getClientIds() const;
};