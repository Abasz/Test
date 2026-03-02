import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core";

import { GridCells, TilePosition } from "../utils/tile-layout.interfaces";

/**
 * Manages visual highlight state for the tile grid during drag operations.
 * Tracks which cells should be highlighted and whether the current drop position is invalid.
 */
@Injectable()
export class TileHighlightManager {
    readonly highlightedCells: WritableSignal<GridCells> = signal<GridCells>([]);
    readonly isDropInvalid: WritableSignal<boolean> = signal<boolean>(false);

    private readonly highlightedCellKeys: Signal<Set<string>> = computed(
        (): Set<string> =>
            new Set(
                this.highlightedCells().map(
                    (cell: { row: number; column: number }): string => `${cell.row}-${cell.column}`,
                ),
            ),
    );

    isCellHighlighted(row: number, column: number): boolean {
        return this.highlightedCellKeys().has(`${row}-${column}`);
    }

    updateHighlightsForPosition(position: TilePosition): void {
        const cells: Array<{ row: number; column: number }> = [];
        for (let r = position.rowStart; r < position.rowStart + position.rowSpan; r++) {
            for (let c = position.columnStart; c < position.columnStart + position.columnSpan; c++) {
                cells.push({ row: r, column: c });
            }
        }
        this.highlightedCells.set(cells);
    }

    clearAll(): void {
        this.highlightedCells.set([]);
        this.isDropInvalid.set(false);
    }
}
