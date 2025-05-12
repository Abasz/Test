export class Series {
    private maxSeriesLength: number;
    private seriesArray: Array<number>;
    private seriesSum: number;

    constructor(maxSeriesLength: number = 0) {
        this.maxSeriesLength = maxSeriesLength;
        this.seriesSum = 0;
        this.seriesArray = [];
    }

    average(): number {
        if (this.seriesArray.length === 0) {
            return 0;
        }

        return this.seriesSum / this.seriesArray.length;
    }

    get(index: number): number {
        if (index < 0 || index >= this.seriesArray.length) {
            throw new RangeError("Index out of bounds");
        }

        return this.seriesArray[index];
    }

    median(): number {
        if (this.seriesArray.length === 0) {
            return 0;
        }

        const sortedArray = [...this.seriesArray].sort((a: number, b: number): number => a - b);
        const mid = Math.floor(sortedArray.length / 2);

        return sortedArray.length % 2 !== 0
            ? sortedArray[mid]
            : (sortedArray[mid - 1] + sortedArray[mid]) / 2;
    }

    push(value: number): void {
        if (this.maxSeriesLength > 0 && this.seriesArray.length >= this.maxSeriesLength) {
            // remove the first element to maintain the size
            this.seriesSum -= this.seriesArray[0];
            this.seriesArray.shift();
        }

        this.seriesArray.push(value);
        this.seriesSum += value;
    }

    reset(): void {
        this.seriesArray = [];
        this.seriesSum = 0;
    }

    size(): number {
        return this.seriesArray.length;
    }

    sum(): number {
        return this.seriesSum;
    }
}
