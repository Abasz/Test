#pragma once

#include "NimBLEDevice.h"

class IConnectionManagerCallbacks : public NimBLEServerCallbacks
{
protected:
    ~IConnectionManagerCallbacks() = default;

public:
    [[nodiscard]] virtual unsigned char getConnectionCount() const = 0;
};