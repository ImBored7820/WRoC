/**
 * Author: musa -
 * Date: 03/28/2026
 * Time: 17:33:25
 *
 * Description: Describe what the file does
 * Info: WRoC | window.ts | WebStorm
 */

// src/assets/floor.ts
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#c9bbbb",
    1: "#e7cece",
    2: "#b4b0b0"
};

const pattern = [
    0,1,1,1,1,0,
    1,1,2,2,1,1,
    1,2,2,2,2,1,
    1,2,2,2,2,1,
    1,1,2,2,1,1,
    0,1,1,1,1,0
];

export function drawWindow(ctx: CanvasRenderingContext2D, x: number, y: number,
                          tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}