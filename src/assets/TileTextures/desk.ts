/**
 * Author: musa -
 * Date: 04/03/2026
 * Time: 08:58:05
 *
 * Description: Describe what the file does
 * Info: WRoC | desk.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#5a3d2b",
    1: "#7a5438",
    2: "#8c6342",
    3: "#6e4a32",
    4: "#4e3020",
    5: "#2a2a30",
    6: "#44332a"
};

const pattern360 = [
    // 0 turned 360 degrees (desk top-down, chair at bottom, monitor on back edge)
    4, 1, 1, 2, 1, 4,
    1, 2, 2, 1, 2, 1,
    2, 1, 5, 5, 1, 2,
    1, 2, 1, 2, 2, 1,
    4, 1, 2, 1, 1, 4,
    0, 6, 6, 6, 6, 0,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise (chair on left, monitor on right edge)
    0, 4, 1, 2, 1, 4,
    6, 1, 2, 1, 2, 1,
    6, 2, 1, 5, 2, 1,
    6, 1, 2, 5, 1, 2,
    6, 1, 2, 1, 2, 1,
    0, 4, 1, 2, 1, 4,
]

const pattern180 = [
    // 0 turned 180 degrees (chair at top)
    0, 6, 6, 6, 6, 0,
    4, 1, 1, 2, 1, 4,
    1, 2, 2, 1, 2, 1,
    2, 1, 5, 5, 1, 2,
    1, 2, 1, 2, 2, 1,
    4, 1, 2, 1, 1, 4,
]


export function drawDesk(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}