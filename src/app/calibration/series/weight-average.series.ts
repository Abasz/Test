import { Series } from "./series";

export class WeightedAverageSeries {
    private weightSeries: Series;
    private weightedSeries: Series;

    constructor(maxSeriesLength: number = 0) {
        this.weightSeries = new Series(maxSeriesLength);
        this.weightedSeries = new Series(maxSeriesLength);
    }

    average(): number {
        if (this.weightedSeries.size() === 0 || this.weightedSeries.sum() === 0) {
            return 0;
        }

        return this.weightedSeries.sum() / this.weightSeries.sum();
    }

    push(value: number, weight: number): void {
        this.weightedSeries.push(value * weight);
        this.weightSeries.push(weight);
    }

    reset(): void {
        this.weightedSeries.reset();
        this.weightSeries.reset();
    }

    size(): number {
        return this.weightedSeries.size();
    }
}
