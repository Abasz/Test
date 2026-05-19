#pragma once

class IPowerManagerService
{
protected:
    ~IPowerManagerService() = default;

public:
    [[nodiscard]] virtual unsigned char setup() const = 0;
    virtual void goToSleep() const = 0;
    [[nodiscard]] virtual unsigned char measureBattery() const = 0;
};