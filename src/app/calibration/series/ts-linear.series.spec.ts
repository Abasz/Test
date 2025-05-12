import { testCases } from "./regression-test-data.spec";
import { TSLinearSeries } from "./ts-linear.series";

fdescribe("Theil Sen Linear Regression", (): void => {
    const testMaxSize = 7;
    let tsReg: TSLinearSeries;

    beforeEach((): void => {
        tsReg = new TSLinearSeries(testMaxSize);
        testCases.forEach((testCase: Array<number>): void => {
            tsReg.push(testCase[1] / 1e6, testCase[0] / 1e6);
        });
    });

    it("should correctly calculate Median", (): void => {
        const expectedMedian = -39.37665713543009;
        expect(tsReg.median()).toEqual(expectedMedian);
    });

    it("should assign the median to coefficientA", (): void => {
        expect(tsReg.median()).toEqual(tsReg.coefficientA());
    });

    it("should calculate coefficientB correctly", (): void => {
        const tsRegCoeffB: TSLinearSeries = new TSLinearSeries(testMaxSize);

        testCases.forEach((testCase: Array<number>): void => {
            tsRegCoeffB.push(testCase[1] / 1e6, testCase[0] / 1e6);
            expect(tsRegCoeffB.coefficientB()).toEqual(testCase[3]);
        });
    });

    it("should be empty after reset", (): void => {
        tsReg.reset();
        expect(tsReg.median()).toEqual(0);
    });
});
