/**
 * Author: 2030971 -
 * Date: 03/27/2026
 * Time: 14:06:18
 *
 * Description: Describe what the file does
 * Info: WRoC | wall.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#000000",
    1: "#0a0a0c",
    2: "#0f0f14",
    3: "#060608"
};

const pattern360 = [
    // 0 turned 360 degrees (base: horizontal brick courses)
    1, 1, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0,
    1, 2, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 2, 1,
    0, 0, 0, 0, 0, 0,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise (vertical brick courses)
    0, 1, 0, 1, 0, 1,
    0, 1, 0, 2, 0, 1,
    0, 0, 0, 1, 0, 1,
    0, 1, 0, 1, 0, 0,
    0, 2, 0, 1, 0, 1,
    0, 1, 0, 0, 0, 1,
]

const pattern180 = [
    // 0 turned 180 degrees
    0, 0, 0, 0, 0, 0,
    1, 2, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 2, 1,
    0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 1, 1,
]


export function drawWall(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}