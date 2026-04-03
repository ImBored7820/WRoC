/**
 * Author: musa -
 * Date: 04/03/2026
 * Time: 08:58:05
 *
 * Description: Describe what the file does
 * Info: WRoC | desk.ts | WebStorm
 */

import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#5a3d2b",
    1: "#7a5438",
    2: "#8c6342",
    3: "#6e4a32",
    4: "#4e3020"
};

const pattern = [
    4, 4, 0, 0, 4, 4,
    4, 1, 1, 1, 1, 4,
    0, 1, 2, 2, 1, 0,
    0, 1, 3, 3, 1, 0,
    4, 1, 1, 1, 1, 4,
    4, 4, 0, 0, 4, 4
];

export function drawDesk(ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}