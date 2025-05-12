import { OLSLinearSeries } from "./ols-linear.series";
import { testCases, testMaxSize } from "./regression-test-data.spec";

fdescribe("Ordinary Least Square Linear Regression", (): void => {
    let olsReg: OLSLinearSeries;

    beforeEach((): void => {
        olsReg = new OLSLinearSeries(testMaxSize);
        testCases.forEach(([x, y]: [number, number, number, number, number]): void => {
            olsReg.push(x, y);
        });
    });

    it("should correctly calculate the slope", (): void => {
        const expectedSlope = -0.0257004818;
        expect(olsReg.slope()).toBeCloseTo(expectedSlope, 5);
    });

    it("should correctly calculate the goodness of fit", (): void => {
        const expectedGoodnessOfFit = 0.9961418613;
        expect(olsReg.goodnessOfFit()).toBeCloseTo(expectedGoodnessOfFit, 5);
    });
});
