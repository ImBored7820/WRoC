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

const pattern0 = [
    1,1,1,1,1,1,
    2,2,2,2,2,2,
    3,3,0,0,3,3,
    3,3,0,0,3,3,
    2,2,2,2,2,2,
    1,1,1,1,1,1,
]

const pattern90 = [
    1,1,1,1,0,0,
    2,2,2,2,2,2,
    3,1,0,0,3,3,
    3,3,0,0,3,3,
    2,2,2,2,2,2,
    1,1,1,1,1,1,
]

const pattern180 = [
    1,1,1,1,1,0,
    2,2,2,2,2,2,
    3,3,0,0,3,3,
    3,3,0,0,3,3,
    2,2,2,2,2,2,
    1,1,1,1,1,1,
]

const pattern270 = [
    1,1,1,1,1,1,
    2,1,3,2,2,2,
    3,3,0,0,3,3,
    3,3,0,0,3,3,
    2,2,2,2,2,2,
    1,1,1,1,1,1,
]

export function drawWall(degree: 0 | 90 | 180 | 270, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 0) drawTile(ctx, x, y, tileWidth, tileHeight, pattern0, colors, rows, cols);
    else if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 270) drawTile(ctx, x, y, tileWidth, tileHeight, pattern270, colors, rows, cols);
}