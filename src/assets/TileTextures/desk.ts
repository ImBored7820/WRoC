/**
 * Author: musa -
 * Date: 04/03/2026
 *
 * Description: Desk with warm wood tones and desktop surface
 * Info: WRoC | desk.ts | WebStorm
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#4e3020",
    1: "#7a5438",
    2: "#8c6342",
    3: "#6e4a32",
    4: "#5a3d2b",
    5: "#a07850",
    6: "#2a2a30",
};

const pattern360 = [
    4, 4, 4, 4, 4, 4,
    4, 5, 5, 5, 5, 4,
    4, 5, 2, 2, 5, 4,
    4, 5, 2, 2, 5, 4,
    4, 4, 4, 4, 4, 4,
    0, 6, 6, 6, 6, 0,
];

const pattern90 = [
    0, 4, 4, 4, 4, 0,
    6, 4, 5, 5, 4, 6,
    6, 4, 5, 5, 4, 6,
    6, 4, 5, 5, 4, 6,
    6, 4, 4, 4, 4, 6,
    0, 4, 4, 4, 4, 0,
];

const pattern180 = [
    0, 6, 6, 6, 6, 0,
    4, 4, 4, 4, 4, 4,
    4, 5, 5, 5, 5, 4,
    4, 5, 2, 2, 5, 4,
    4, 5, 2, 2, 5, 4,
    4, 4, 4, 4, 4, 4,
];

export function drawDesk(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
