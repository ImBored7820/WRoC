/**
 * Author: musa -
 * Date: 03/28/2026
 * Time: 17:33:12
 *
 * Description: Describe what the file does
 * Info: WRoC | door.ts | WebStorm
 */

// src/assets/floor.ts
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#8f2e2e",
    1: "#813c3c",
    2: "#2c0c0c"
};

const pattern = [
    0,1,1,1,1,0,
    1,1,2,2,1,1,
    1,2,2,2,2,1,
    1,2,2,2,2,1,
    1,1,2,2,1,1,
    0,1,1,1,1,0
];

export function drawDoor(ctx: CanvasRenderingContext2D, x: number, y: number,
                          tileWidth: number, tileHeight: number) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}