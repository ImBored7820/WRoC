/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Locker tile texture — gray slats with vents and handle
 * Info: WRoC | locker.ts | WebStorm
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#6a6a70",
    1: "#7a7a82",
    2: "#5a5a60",
    3: "#4a4a50",
    4: "#9a9aa0",
    5: "#3a3a40",
};

const pattern360 = [
    2, 2, 2, 2, 2, 2,
    1, 0, 1, 0, 1, 2,
    1, 3, 1, 3, 1, 2,
    1, 0, 1, 0, 1, 2,
    1, 5, 1, 5, 4, 2,
    2, 2, 2, 2, 2, 2,
];

const pattern90 = [
    2, 1, 1, 1, 1, 2,
    2, 0, 3, 0, 5, 2,
    2, 1, 1, 1, 1, 2,
    2, 0, 3, 0, 5, 2,
    2, 1, 1, 1, 4, 2,
    2, 2, 2, 2, 2, 2,
];

const pattern180 = [
    2, 2, 2, 2, 2, 2,
    2, 4, 1, 5, 1, 1,
    2, 0, 1, 3, 0, 1,
    2, 0, 1, 0, 1, 1,
    2, 3, 1, 3, 1, 1,
    2, 2, 2, 2, 2, 2,
];

export function drawLocker(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if (degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
