/**
 * GBC Pokemon-style floor — simple checkerboard linoleum tile
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#d8d0b0", // light cream tile
    1: "#c8c0a0", // slightly darker tile
    2: "#b8b090", // accent dot (rare)
};

// Clean 2×2 checker — reads instantly at Pokemon tile scale
const pattern360 = [
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
];

const pattern90 = [
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
];

const pattern180 = [
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
];

export function drawFloor(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if (degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
