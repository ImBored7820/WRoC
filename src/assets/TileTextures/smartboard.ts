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
};

const pattern = [
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 4, 1, 0,
    0, 1, 4, 2, 1, 0,
    0, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0,
];

export function drawSmartBoard(ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}