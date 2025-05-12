import { Series } from "./series";

export class TSLinearSeries {
    private a: number = 0;
    private b: number = 0;
    private maxSeriesLength: number;
    private seriesX: Series;
    private seriesY: Series;
    private shouldRecalculateA: boolean = true;
    private shouldRecalculateB: boolean = true;
    private slopes: Array<Array<number>> = [];

    constructor(maxSeriesLength: number = 0) {
        this.maxSeriesLength = maxSeriesLength;
        this.seriesX = new Series(maxSeriesLength);
        this.seriesY = new Series(maxSeriesLength);
    }

    coefficientA(): number {
        if (this.shouldRecalculateA) {
            this.a = this.median();
            this.shouldRecalculateA = false;
        }

        return this.a;
    }

    coefficientB(): number {
        if (this.shouldRecalculateB) {
            this.a = this.median();
            const intercepts: Series = new Series(this.maxSeriesLength);
            for (let i = 0; i < this.seriesX.size() - 1; i++) {
                intercepts.push(this.seriesY.get(i) - this.a * this.seriesX.get(i));
            }
            this.b = intercepts.median();
            this.shouldRecalculateB = false;
        }

        return this.b;
    }

    median(): number {
        if (this.slopes.length === 0) {
            return 0;
        }

        const flattened: Array<number> = [];
        for (const slope of this.slopes) {
            flattened.push(...slope);
        }

        const mid: number = Math.floor(flattened.length / 2);
        flattened.sort((a: number, b: number): number => a - b);

        return flattened.length % 2 !== 0 ? flattened[mid] : (flattened[mid - 1] + flattened[mid]) / 2;
    }

    push(pointX: number, pointY: number): void {
        this.seriesX.push(pointX);
        this.seriesY.push(pointY);
        this.shouldRecalculateA = true;
        this.shouldRecalculateB = true;

        if (this.maxSeriesLength > 0 && this.slopes.length >= this.maxSeriesLength) {
            this.slopes.shift();
        }

        if (this.seriesX.size() > 1) {
            for (let i = 0; i < this.seriesX.size() - 1; i++) {
                const result: number = this.calculateSlope(i, this.slopes.length);
                this.slopes[i].push(result);
            }
        }

        this.slopes.push([]);
    }

    reset(): void {
        this.seriesX.reset();
        this.seriesY.reset();
        this.slopes = [];
        this.a = 0;
        this.b = 0;
    }

    size(): number {
        return this.seriesY.size();
    }

    yAtSeriesBegin(): number {
        return this.seriesY.get(0);
    }

    private calculateSlope(pointOne: number, pointTwo: number): number {
        const seriesXPointOne: number = this.seriesX.get(pointOne);
        const seriesXPointTwo: number = this.seriesX.get(pointTwo);

        if (pointOne === pointTwo || seriesXPointOne === seriesXPointTwo) {
            return 0;
        }

        return (
            (this.seriesY.get(pointTwo) - this.seriesY.get(pointOne)) / (seriesXPointTwo - seriesXPointOne)
        );
    }
}
