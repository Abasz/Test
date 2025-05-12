export class Series extends Array<number> {
    average(): number {
        return this.sum() / this.length;
    }
    median(): number {
        const sortedArray = [...this];
        sortedArray.sort();
        const mid = Math.floor(sortedArray.length / 2);

        return sortedArray.length % 2 === 0
            ? (sortedArray[mid] + sortedArray[mid - 1]) / 2
            : sortedArray[mid];
    }
    sum(): number {
        return this.reduce((accumulator: number, current: number): number => accumulator + current, 0);
    }
}
