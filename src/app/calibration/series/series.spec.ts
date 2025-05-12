import { Series } from "./series";

fdescribe("Series", (): void => {
    it("should initialize with an empty series and sum of 0", (): void => {
        const series: Series = new Series();
        expect(series.size()).toBe(0);
        expect(series.sum()).toBe(0);
    });

    it("should calculate the average correctly", (): void => {
        const series: Series = new Series();
        series.push(1);
        series.push(2);
        series.push(3);
        expect(series.average()).toBe(2);
    });

    it("should calculate the median correctly for odd number of elements", (): void => {
        const series: Series = new Series();
        series.push(3);
        series.push(1);
        series.push(2);
        expect(series.median()).toBe(2);
    });

    it("should calculate the median correctly for even number of elements", (): void => {
        const series: Series = new Series();
        series.push(3);
        series.push(1);
        series.push(2);
        series.push(4);
        expect(series.median()).toBe(2.5);
    });

    it("should maintain maxSeriesLength by removing oldest values", (): void => {
        const maxSeriesLength = 3;
        const series: Series = new Series(maxSeriesLength);
        series.push(1);
        series.push(2);
        series.push(3);
        series.push(4); // this should push out 1
        expect(series.size()).toBe(3);
        expect(series.sum()).toBe(9); // 2 + 3 + 4
        expect(series.get(0)).toBe(2);
    });

    it("should reset the series", (): void => {
        const series: Series = new Series();
        series.push(1);
        series.push(2);
        series.push(3);
        series.reset();
        expect(series.size()).toBe(0);
        expect(series.sum()).toBe(0);
    });

    it("should throw an error when accessing an invalid index", (): void => {
        const series: Series = new Series();
        expect((): number => series.get(0)).toThrowError(RangeError, "Index out of bounds");
    });
});
