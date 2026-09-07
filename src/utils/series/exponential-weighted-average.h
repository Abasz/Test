#pragma once

#include "../configuration.h"

class ExponentialWeightedAverage
{
    Configurations::precision weightedSum;
    Configurations::precision totalWeight;
    Configurations::precision initialBuffer;

    Configurations::precision decayFactor = 0.0;

public:
    constexpr explicit ExponentialWeightedAverage(
        const unsigned short _windowSize = 50U,
        const Configurations::precision _initialBuffer = 0)
        : weightedSum(_initialBuffer),
          totalWeight(_initialBuffer),
          initialBuffer(_initialBuffer),
          decayFactor(1.0 - (1.0 / static_cast<Configurations::precision>(_windowSize)))
    {
    }

    void push(Configurations::precision value, Configurations::precision weight);
    [[nodiscard]] Configurations::precision average() const;
    void reset();
    void decay(Configurations::precision decayFactorOverride);
};
