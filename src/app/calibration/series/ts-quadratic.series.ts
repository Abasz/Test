import { Series } from "./series";
import { TSLinearSeries } from "./ts-linear.series";

export class TSQuadraticSeries {
    private a: number = 0;
    private b: number = 0;
    private c: number = 0;

    private maxSeriesLength: number;

    private seriesA: Array<Array<number>> = [];
    private seriesX: Series;
    private seriesY: Series;

    constructor(maxSeriesLength: number = 0) {
        this.maxSeriesLength = maxSeriesLength;

        this.seriesX = new Series(this.maxSeriesLength);
        this.seriesY = new Series(this.maxSeriesLength);
    }

    firstDerivativeAtPosition(position: number): number {
        if (this.seriesX.size() < 3 || position >= this.seriesX.size()) {
            return 0;
        }

        return this.a * 2 * this.seriesX.get(position) + this.b;
    }

    goodnessOfFit(): number {
        if (this.seriesX.size() < 3) {
            return 0;
        }

        let sse = 0;
        let sst = 0;

        for (let i = 0; i < this.seriesX.size(); i++) {
            const projectedX: number = this.projectX(this.seriesX.get(i));
            sse += (this.seriesY.get(i) - projectedX) ** 2;
            const averageY: number = this.seriesY.average();
            sst += (this.seriesY.get(i) - averageY) ** 2;
        }

        if (sst === 0 || sse > sst) {
            return 0;
        }

        if (sse === 0) {
            return 1;
        }

        return 1 - sse / sst;
    }

    push(pointX: number, pointY: number): void {
        if (this.maxSeriesLength > 0 && this.seriesX.size() >= this.maxSeriesLength) {
            this.seriesA.shift();
        }

        this.seriesX.push(pointX);
        this.seriesY.push(pointY);

        if (this.seriesX.size() < 3) {
            this.a = 0;
            this.b = 0;
            this.c = 0;

            return;
        }

        this.seriesA.push([]);

        let i = 0;
        let j = 0;

        while (i < this.seriesX.size() - 2) {
            j = i + 1;
            while (j < this.seriesX.size() - 1) {
                this.seriesA[i].push(this.calculateA(i, j, this.seriesX.size() - 1));
                j++;
            }
            i++;
        }

        this.a = this.seriesAMedian();

        const linearResidue: TSLinearSeries = new TSLinearSeries(this.maxSeriesLength);

        for (i = 0; i < this.seriesX.size(); i++) {
            const seriesXPointI: number = this.seriesX.get(i);
            linearResidue.push(seriesXPointI, this.seriesY.get(i) - this.a * (seriesXPointI * seriesXPointI));
        }

        this.b = linearResidue.coefficientA();
        this.c = linearResidue.coefficientB();
    }

    secondDerivativeAtPosition(position: number): number {
        if (this.seriesX.size() < 3 || position >= this.seriesX.size()) {
            return 0;
        }

        return this.a * 2;
    }

    private calculateA(pointOne: number, pointTwo: number, pointThree: number): number {
        const xPointOne: number = this.seriesX.get(pointOne);
        const xPointTwo: number = this.seriesX.get(pointTwo);
        const xPointThree: number = this.seriesX.get(pointThree);

        if (xPointOne === xPointTwo || xPointOne === xPointThree || xPointTwo === xPointThree) {
            return 0;
        }

        const yPointThree: number = this.seriesY.get(pointThree);
        const yPointTwo: number = this.seriesY.get(pointTwo);

        return (
            (xPointOne * (yPointThree - yPointTwo) +
                this.seriesY.get(pointOne) * (xPointTwo - xPointThree) +
                (xPointThree * yPointTwo - xPointTwo * yPointThree)) /
            ((xPointOne - xPointTwo) * (xPointOne - xPointThree) * (xPointTwo - xPointThree))
        );
    }

    private projectX(pointX: number): number {
        if (this.seriesX.size() < 3) {
            return 0;
        }

        return this.a * pointX * pointX + this.b * pointX + this.c;
    }

    private seriesAMedian(): number {
        const flattened: Array<number> = [];

        for (const input of this.seriesA) {
            flattened.push(...input);
        }

        const mid: number = Math.floor(flattened.length / 2);
        flattened.sort((a: number, b: number): number => a - b);

        return flattened.length % 2 !== 0 ? flattened[mid] : (flattened[mid - 1] + flattened[mid]) / 2;
    }
}
