#pragma once

#include "NimBLEDevice.h"

#include "../callbacks/ota.callbacks.h"

class IOtaBleService
{
protected:
    ~IOtaBleService() = default;

public:
    virtual NimBLEService *setup(NimBLEServer *server) = 0;
    [[nodiscard]] virtual NimBLECharacteristic *getOtaTx() const = 0;
};
