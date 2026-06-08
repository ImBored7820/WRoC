/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Bulletin board tile — cork background with pinned papers
 * Info: WRoC | bulletinBoard.ts | WebStorm
 */
import { drawTile } from "./tileTemplate.js";

const rows = 6;
const cols = 6;

const colors: { [key: number]: string } = {
    0: "#8a6a4a",
    1: "#9a7a5a",
    2: "#7a5a3a",
    3: "#e8d060",
    4: "#60a0e0",
    5: "#e06060",
    6: "#60c080",
};

const pattern360 = [
    2, 2, 2, 2, 2, 2,
    2, 3, 3, 4, 4, 2,
    2, 1, 5, 5, 6, 2,
    2, 1, 1, 3, 1, 2,
    2, 4, 6, 1, 5, 2,
    2, 2, 2, 2, 2, 2,
];

const pattern90 = [
    2, 2, 2, 2, 2, 2,
    2, 3, 1, 4, 1, 2,
    2, 3, 5, 6, 4, 2,
    2, 5, 1, 3, 6, 2,
    2, 6, 4, 5, 3, 2,
    2, 2, 2, 2, 2, 2,
];

const pattern180 = [
    2, 2, 2, 2, 2, 2,
    2, 5, 1, 6, 4, 2,
    2, 3, 1, 1, 5, 2,
    2, 6, 5, 5, 1, 2,
    2, 4, 4, 3, 3, 2,
    2, 2, 2, 2, 2, 2,
];

export function drawBulletinBoard(degree: 90 | 180 | 360, ctx: CanvasRenderingContext2D, x: number, y: number, tileWidth: number, tileHeight: number) {
    if (degree == 90) drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180) drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360) drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
