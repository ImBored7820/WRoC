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
    0: "black",
    1: "darkgray",
    2: "gray"
};

const pattern = [
    0,0,0,0,0,0,
    0,0,1,1,0,0,
    0,1,1,1,1,0,
    0,1,1,1,1,0,
    2,2,2,2,2,2,
    2,2,2,2,2,2
];

export function drawWall(ctx: CanvasRenderingContext2D, x: number, y: number,
                         tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}