import { Series } from "./series";

export class OLSLinearSeries {
    private seriesX: Series;
    private seriesXSquare: Series;
    private seriesXY: Series;
    private seriesY: Series;
    private seriesYSquare: Series;

    constructor(maxSeriesLength: number = 0) {
        this.seriesX = new Series(maxSeriesLength);
        this.seriesXSquare = new Series(maxSeriesLength);
        this.seriesY = new Series(maxSeriesLength);
        this.seriesYSquare = new Series(maxSeriesLength);
        this.seriesXY = new Series(maxSeriesLength);
    }

    goodnessOfFit(): number {
        if (this.seriesX.size() < 2 || this.seriesX.sum() === 0) {
            return 0;
        }

        const n: number = this.seriesX.size();
        const slope: number = this.slope();
        const intercept: number = (this.seriesY.sum() - slope * this.seriesX.sum()) / n;

        const sse: number =
            this.seriesYSquare.sum() - intercept * this.seriesY.sum() - slope * this.seriesXY.sum();
        const sst: number = this.seriesYSquare.sum() - (this.seriesY.sum() * this.seriesY.sum()) / n;

        return sst === 0 ? 0 : 1 - sse / sst;
    }

    push(pointX: number, pointY: number): void {
        this.seriesX.push(pointX);
        this.seriesXSquare.push(pointX * pointX);
        this.seriesY.push(pointY);
        this.seriesYSquare.push(pointY * pointY);
        this.seriesXY.push(pointX * pointY);
    }

    reset(): void {
        this.seriesX.reset();
        this.seriesXSquare.reset();
        this.seriesY.reset();
        this.seriesYSquare.reset();
        this.seriesXY.reset();
    }

    size(): number {
        return this.seriesY.size();
    }

    slope(): number {
        if (this.seriesX.size() < 2 || this.seriesX.sum() === 0) {
            return 0;
        }

        const n: number = this.seriesX.size();
        const numerator: number = n * this.seriesXY.sum() - this.seriesX.sum() * this.seriesY.sum();
        const denominator: number = n * this.seriesXSquare.sum() - this.seriesX.sum() * this.seriesX.sum();

        return denominator === 0 ? 0 : numerator / denominator;
    }

    yAtSeriesBegin(): number {
        return this.seriesY.get(0);
    }
}
