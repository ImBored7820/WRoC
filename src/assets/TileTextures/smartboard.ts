/**
 * Author: musa -
 * Date: 04/03/2026
 * Time: 08:55:40
 *
 * Description: Describe what the file does
 * Info: WRoC | smartboard.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#080810",
    1: "#101018",
    2: "#181822",
    3: "#0c0c14",
    4: "#20202c",
    5: "#2a4a6a",
    6: "#3db55f",
};

const pattern360 = [
    // 0 turned 360 degrees (bezel + screen + power LED + mount bracket at bottom)
    0, 0, 0, 0, 0, 0,
    0, 5, 5, 5, 5, 0,
    0, 5, 2, 2, 5, 0,
    0, 5, 2, 2, 5, 0,
    0, 5, 5, 5, 6, 0,
    0, 4, 0, 0, 4, 0,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise (mount bracket on left edge)
    0, 0, 0, 0, 0, 0,
    4, 5, 5, 5, 5, 0,
    0, 5, 2, 2, 5, 0,
    0, 5, 2, 2, 5, 0,
    4, 6, 5, 5, 5, 0,
    0, 0, 0, 0, 0, 0,
]

const pattern180 = [
    // 0 turned 180 degrees (mount bracket at top)
    0, 4, 0, 0, 4, 0,
    0, 6, 5, 5, 5, 0,
    0, 5, 2, 2, 5, 0,
    0, 5, 2, 2, 5, 0,
    0, 5, 5, 5, 5, 0,
    0, 0, 0, 0, 0, 0,
]


export function drawSmartBoard(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}