/**
 * Author: musa -
 * Date: 04/03/2026
 * Time: 08:56:47
 *
 * Description: Describe what the file does
 * Info: WRoC | whiteboard.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#b0b0b0",
    1: "#e0e0e0",
    2: "#f0f0f0",
    3: "#d8d8d8",
    4: "#999999"
};

const pattern = [
    4, 4, 4, 4, 4, 4,
    4, 1, 1, 1, 1, 4,
    4, 1, 2, 2, 1, 4,
    4, 1, 2, 2, 1, 4,
    4, 3, 3, 3, 3, 4,
    4, 4, 4, 4, 4, 4
];

export function drawWhiteBoard(ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}