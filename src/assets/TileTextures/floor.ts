/**
 * Author: 2030971 -
 * Date: 03/28/2026
 * Time: 14:06:18
 *
 * Description: Describe what the file does
 * Info: WRoC | wall.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#3a3a3e",
    1: "#3e3e42",
    2: "#424247",
    3: "#2e2e33",
    4: "#353538"
};

const pattern360 = [
    // 0 turned 360 degrees (base: 2x2 tiles separated by grout)
    1, 1, 3, 1, 1, 3,
    1, 4, 3, 1, 2, 3,
    3, 3, 3, 3, 3, 3,
    1, 2, 3, 1, 4, 3,
    1, 1, 3, 1, 1, 3,
    3, 3, 3, 3, 3, 3,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise
    3, 1, 1, 3, 1, 1,
    3, 1, 2, 3, 4, 1,
    3, 3, 3, 3, 3, 3,
    3, 1, 1, 3, 1, 1,
    3, 1, 4, 3, 2, 1,
    3, 3, 3, 3, 3, 3,
]

const pattern180 = [
    // 0 turned 180 degrees
    3, 3, 3, 3, 3, 3,
    3, 1, 1, 3, 1, 1,
    3, 4, 1, 3, 2, 1,
    3, 3, 3, 3, 3, 3,
    3, 2, 1, 3, 4, 1,
    3, 1, 1, 3, 1, 1,
]


export function drawFloor(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}