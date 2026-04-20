/**
 * Author: musa -
 * Date: 03/28/2026
 * Time: 17:33:12
 *
 * Description: Describe what the file does
 * Info: WRoC | door.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#5c2a0e",
    1: "#7a3b1a",
    2: "#8f4c28",
    3: "#6b3214",
    4: "#4a2008",
    5: "#c9a15b"
};

const pattern360 = [
    // 0 turned 360 degrees (door facing up: frame with handle on right)
    0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 0,
    0, 2, 1, 1, 2, 0,
    0, 3, 3, 3, 3, 0,
    0, 2, 1, 5, 2, 0,
    0, 0, 0, 0, 0, 0,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise
    0, 0, 0, 0, 0, 0,
    0, 2, 3, 2, 2, 0,
    0, 1, 3, 1, 2, 0,
    0, 5, 3, 1, 2, 0,
    0, 2, 3, 2, 2, 0,
    0, 0, 0, 0, 0, 0,
]

const pattern180 = [
    // 0 turned 180 degrees
    0, 0, 0, 0, 0, 0,
    0, 2, 5, 1, 2, 0,
    0, 3, 3, 3, 3, 0,
    0, 2, 1, 1, 2, 0,
    0, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0,
]


export function drawDoor(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}