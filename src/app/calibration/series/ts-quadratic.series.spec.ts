import { testCases, testMaxSize } from "./regression-test-data.spec";
import { TSQuadraticSeries } from "./ts-quadratic.series";

fdescribe("Theil Sen Quadratic Regression", (): void => {
    let tsQuad: TSQuadraticSeries;

    beforeEach((): void => {
        tsQuad = new TSQuadraticSeries(testMaxSize);
        testCases.forEach(([x, _, y]: [number, number, number, number, number]): void => {
            tsQuad.push(x / 1e6, y);
        });
    });

    it("firstDerivativeAtPosition should return correct values", (): void => {
        expect(tsQuad.firstDerivativeAtPosition(0)).toBeCloseTo(51.21269541835392);
        expect(tsQuad.firstDerivativeAtPosition(1)).toBeCloseTo(52.632672200105446);
        expect(tsQuad.firstDerivativeAtPosition(2)).toBeCloseTo(54.01497821210333);
        expect(tsQuad.firstDerivativeAtPosition(3)).toBeCloseTo(55.36640827543397);
        expect(tsQuad.firstDerivativeAtPosition(4)).toBeCloseTo(56.68125896514397);
        expect(tsQuad.firstDerivativeAtPosition(5)).toBeCloseTo(57.96579700741671);
        expect(tsQuad.firstDerivativeAtPosition(6)).toBeCloseTo(59.2248456690337);
        expect(tsQuad.firstDerivativeAtPosition(7)).toBe(0);
        expect(tsQuad.firstDerivativeAtPosition(8)).toBe(0);
    });

    it("secondDerivativeAtPosition should return correct values", (): void => {
        const secondDerExpected = 35.20632687257407;
        expect(tsQuad.secondDerivativeAtPosition(0)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(1)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(2)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(3)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(4)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(5)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(6)).toBeCloseTo(secondDerExpected);
        expect(tsQuad.secondDerivativeAtPosition(7)).toBe(0);
        expect(tsQuad.secondDerivativeAtPosition(8)).toBe(0);
    });

    it("should calculate correct goodness of fit", (): void => {
        const tsQuadGoodness: TSQuadraticSeries = new TSQuadraticSeries(testMaxSize);

        testCases.forEach(([x, _, y, __, result]: [number, number, number, number, number]): void => {
            tsQuadGoodness.push(x / 1e6, y);
            expect(tsQuadGoodness.goodnessOfFit()).toEqual(result);
        });
    });
});
