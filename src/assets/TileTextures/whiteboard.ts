/**
 * Author: musa -
 * Date: 04/03/2026
 *
 * Description: Whiteboard with pen tray in corner
 * Info: WRoC | whiteboard.ts | WebStorm
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#999999",
    1: "#e8e8e8",
    2: "#f5f5f5",
    3: "#d8d8d8",
    4: "#707070",
    5: "#c0c0c0",
    6: "#4a7acc",
};

const pattern360 = [
    4, 4, 4, 4, 4, 4,
    4, 2, 2, 2, 2, 4,
    4, 2, 1, 1, 2, 4,
    4, 2, 1, 1, 2, 4,
    4, 2, 2, 2, 2, 4,
    4, 4, 4, 4, 6, 5,
];

const pattern90 = [
    4, 4, 4, 4, 4, 4,
    4, 2, 2, 2, 2, 4,
    4, 2, 1, 1, 2, 4,
    5, 2, 1, 1, 2, 4,
    6, 2, 2, 2, 2, 4,
    4, 4, 4, 4, 4, 4,
];

const pattern180 = [
    5, 6, 4, 4, 4, 4,
    4, 2, 2, 2, 2, 4,
    4, 2, 1, 1, 2, 4,
    4, 2, 1, 1, 2, 4,
    4, 2, 2, 2, 2, 4,
    4, 4, 4, 4, 4, 4,
];

export function drawWhiteBoard(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
