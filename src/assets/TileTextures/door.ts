/**
 * GBC Pokemon-style door — brown wood panel with light window strip
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#382010", // frame
    1: "#503018", // door dark
    2: "#684020", // door mid
    3: "#886030", // door light
    4: "#a8c8e8", // window glass
    5: "#c8a040", // handle
};

const pattern360 = [
    0, 0, 0, 0, 0, 0,
    0, 4, 4, 4, 4, 0,
    0, 2, 2, 2, 3, 0,
    0, 2, 2, 2, 3, 0,
    0, 1, 1, 5, 1, 0,
    0, 0, 0, 0, 0, 0,
];

const pattern90 = [
    0, 0, 0, 0, 0, 0,
    0, 4, 2, 2, 1, 0,
    0, 4, 2, 2, 1, 0,
    0, 4, 3, 3, 5, 0,
    0, 4, 2, 2, 1, 0,
    0, 0, 0, 0, 0, 0,
];

const pattern180 = [
    0, 0, 0, 0, 0, 0,
    0, 1, 5, 1, 1, 0,
    0, 3, 2, 2, 2, 0,
    0, 3, 2, 2, 2, 0,
    0, 4, 4, 4, 4, 0,
    0, 0, 0, 0, 0, 0,
];

export function drawDoor(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if (degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
