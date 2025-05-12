import { WeightedAverageSeries } from "./weight-average.series";

fdescribe("WeightedAverageSeries", (): void => {
    describe("average method", (): void => {
        it("should return 0 if there are no elements", (): void => {
            const weightedAverageSeries = new WeightedAverageSeries();
            expect(weightedAverageSeries.average()).toEqual(0.0);
        });

        it("should return the correct weighted average for a series of elements", (): void => {
            const weightedAverageSeries = new WeightedAverageSeries();

            weightedAverageSeries.push(1.0, 1.0);
            weightedAverageSeries.push(2.0, 2.0);
            weightedAverageSeries.push(3.0, 3.0);

            const expectedAverage = (1.0 * 1.0 + 2.0 * 2.0 + 3.0 * 3.0) / (1.0 + 2.0 + 3.0);
            expect(weightedAverageSeries.average()).toBeCloseTo(expectedAverage, 7);
        });
    });

    describe("reset method", (): void => {
        it("should clear all elements", (): void => {
            const weightedAverageSeries = new WeightedAverageSeries();

            weightedAverageSeries.push(1.0, 1.0);
            weightedAverageSeries.push(2.0, 2.0);

            weightedAverageSeries.reset();

            expect(weightedAverageSeries.size()).toEqual(0);
            expect(weightedAverageSeries.average()).toEqual(0);
        });
    });

    describe("push method", (): void => {
        it("should add elements to both series", (): void => {
            const weightedAverageSeries = new WeightedAverageSeries();

            weightedAverageSeries.push(1.0, 1.0);
            weightedAverageSeries.push(2.0, 2.0);

            expect(weightedAverageSeries.size()).toBe(2);
        });
    });
});
