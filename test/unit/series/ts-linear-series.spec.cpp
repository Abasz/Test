#include "catch2/catch_test_macros.hpp"

#include "../../../src/utils/series/ts-linear-series.h"
#include "./regression.test-cases.spec.h"

TEST_CASE("Theil Sen Linear Regression", "[regression]")
{
    const auto testMaxSize = 7U;
    TSLinearSeries tsReg(testMaxSize);

    for (const auto &testCase : testCases)
    {
        tsReg.push(testCase[1] / 1e6, testCase[0] / 1e6);
    }

    SECTION("should correctly calculate Median")
    {
        const auto expectedMedian = -39.37665713543009;
        REQUIRE(tsReg.median() == expectedMedian);
    }

    SECTION("should assign the median to coefficientA")
    {
        REQUIRE(tsReg.median() == tsReg.coefficientA());
    }

    SECTION("should calculate coefficientB correctly")
    {
        TSLinearSeries tsRegCoeffB(testMaxSize);

        for (const auto &testCase : testCases)
        {
            tsRegCoeffB.push(testCase[1] / 1e6, testCase[0] / 1e6);
            REQUIRE(tsRegCoeffB.coefficientB() == testCase[3]);
        }
    }

    SECTION("should be empty after reset")
    {
        tsReg.reset();
        REQUIRE(tsReg.median() == 0);
    }
}