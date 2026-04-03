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
    0: "#555555",
    1: "#666666",
    2: "#777777"
};

const pattern = [
    0,1,1,1,1,0,
    1,1,2,2,1,1,
    1,2,2,2,2,1,
    1,2,2,2,2,1,
    1,1,2,2,1,1,
    0,1,1,1,1,0
];

export function drawFloor(ctx: CanvasRenderingContext2D, x: number, y: number,
                          tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}