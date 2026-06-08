/**
 * GBC Pokemon-style indoor brick wall — 4-shade tan palette, crisp 2×2 brick grid
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

// Pokemon building interior: warm tan bricks with dark mortar
const colors: { [key: number]: string } = {
    0: "#584818", // dark mortar / shadow
    1: "#786030", // brick shadow
    2: "#a08048", // brick mid
    3: "#c0a060", // brick highlight
};

// Base wall — horizontal mortar bands with offset brick rows
const pattern0 = [
    0, 0, 0, 0, 0, 0,
    2, 3, 2, 3, 2, 3,
    0, 0, 0, 0, 0, 0,
    3, 2, 3, 2, 3, 2,
    1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0,
];

const pattern90 = [
    0, 2, 0, 3, 0, 2,
    0, 3, 0, 2, 0, 3,
    0, 0, 0, 0, 0, 0,
    0, 2, 0, 3, 0, 2,
    0, 3, 0, 2, 0, 3,
    1, 1, 1, 1, 1, 1,
];

const pattern180 = [
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 3, 2, 3, 2, 3,
    0, 0, 0, 0, 0, 0,
    3, 2, 3, 2, 3, 2,
    0, 0, 0, 0, 0, 0,
];

const pattern270 = [
    1, 1, 1, 1, 1, 1,
    2, 0, 3, 0, 2, 0,
    3, 0, 2, 0, 3, 0,
    0, 0, 0, 0, 0, 0,
    2, 0, 3, 0, 2, 0,
    3, 0, 2, 0, 3, 0,
];

export function drawWall(degree: 0 | 90 | 180 | 270, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if (degree == 0) drawTile(ctx, x, y, tileWidth, tileHeight, pattern0, colors, rows, cols);
    else if (degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 270) drawTile(ctx, x, y, tileWidth, tileHeight, pattern270, colors, rows, cols);
}
