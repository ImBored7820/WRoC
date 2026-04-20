/**
 * Author: musa -
 * Date: 03/28/2026
 * Time: 17:33:25
 *
 * Description: Describe what the file does
 * Info: WRoC | window.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#6a8caf",
    1: "#89b4d4",
    2: "#a8d0ee",
    3: "#78a0c2",
    4: "#4a6a88",
    5: "#e8f2fa"
};

const pattern360 = [
    // 0 turned 360 degrees (frame + crossed mullion + glass panes)
    4, 4, 4, 4, 4, 4,
    4, 5, 2, 2, 5, 4,
    4, 2, 4, 4, 1, 4,
    4, 4, 4, 4, 4, 4,
    4, 5, 1, 2, 5, 4,
    4, 4, 4, 4, 4, 4,
]

const pattern90 = [
    // 0 turned 90 degrees clockwise
    4, 4, 4, 4, 4, 4,
    4, 5, 4, 2, 5, 4,
    4, 1, 4, 4, 2, 4,
    4, 2, 4, 4, 2, 4,
    4, 5, 4, 1, 5, 4,
    4, 4, 4, 4, 4, 4,
]

const pattern180 = [
    // 0 turned 180 degrees
    4, 4, 4, 4, 4, 4,
    4, 5, 2, 1, 5, 4,
    4, 4, 4, 4, 4, 4,
    4, 1, 4, 4, 2, 4,
    4, 5, 2, 2, 5, 4,
    4, 4, 4, 4, 4, 4,
]


export function drawWindow(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if(degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if(degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if(degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}