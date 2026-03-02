import { Injectable } from "@angular/core";

import { TileGridHelper } from "../utils/tile-grid.helper";
import {
    GridConfig,
    GridRect,
    PlacedTile,
    TileDragSession,
    TilePosition,
} from "../utils/tile-layout.interfaces";

import { DragOverResult, DragStrategy, DropResult } from "./drag-strategy";

/**
 * Handles resize drag operations.
 * During resize, the tile's size changes based on the pointer position
 * relative to the resize handle direction(s).
 *
 * Min row/column spans are read from the {@link TileDragSession}, which
 * is populated at session-start time by the coordinator.
 */
@Injectable()
export class ResizeDragStrategy implements DragStrategy {
    handleDragOver(
        clientX: number,
        clientY: number,
        gridRect: GridRect,
        session: TileDragSession,
        placedTiles: Array<PlacedTile>,
        gridConfig: GridConfig,
    ): DragOverResult | undefined {
        if (!session.originalPosition || !session.resizeDirections) {
            return undefined;
        }

        const cell = TileGridHelper.calculateCellFromPoint(
            clientX,
            clientY,
            gridRect,
            gridConfig.rows,
            gridConfig.columns,
        );

        const newPosition = TileGridHelper.calculateResizePosition(
            session.originalPosition,
            cell.row,
            cell.column,
            session.resizeDirections,
            session.minRowSpan ?? 1,
            session.minColumnSpan ?? 1,
        );

        const otherPositions = placedTiles
            .filter((placedTile: PlacedTile): boolean => placedTile.id !== session.id)
            .map((placedTile: PlacedTile): TilePosition => placedTile.position);

        return {
            highlightPosition: newPosition,
            isValid: TileGridHelper.isPlacementValid(
                newPosition,
                otherPositions,
                gridConfig.rows,
                gridConfig.columns,
            ),
        };
    }

    handleDrop(
        clientX: number,
        clientY: number,
        gridRect: GridRect,
        session: TileDragSession,
        placedTiles: Array<PlacedTile>,
        gridConfig: GridConfig,
    ): DropResult | undefined {
        if (!session.originalPosition || !session.resizeDirections) {
            return undefined;
        }

        const cell = TileGridHelper.calculateCellFromPoint(
            clientX,
            clientY,
            gridRect,
            gridConfig.rows,
            gridConfig.columns,
        );

        const newPosition = TileGridHelper.calculateResizePosition(
            session.originalPosition,
            cell.row,
            cell.column,
            session.resizeDirections,
            session.minRowSpan ?? 1,
            session.minColumnSpan ?? 1,
        );

        const otherPositions = placedTiles
            .filter((placedTile: PlacedTile): boolean => placedTile.id !== session.id)
            .map((placedTile: PlacedTile): TilePosition => placedTile.position);

        if (
            !TileGridHelper.isPlacementValid(newPosition, otherPositions, gridConfig.rows, gridConfig.columns)
        ) {
            return undefined;
        }

        const tiles = placedTiles.map(
            (placedTile: PlacedTile): PlacedTile =>
                placedTile.id === session.id ? { ...placedTile, position: newPosition } : placedTile,
        );

        return { tiles };
    }
}
