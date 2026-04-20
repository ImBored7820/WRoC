/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: So this file gives the instructions to create the background
 * onto the canvas
 *
 * TODO This will become either just a file for 1 room OR a file for 1 quadrant
 */

import {drawWall} from "../assets/TileTextures/wall.js";
import {drawFloor} from "../assets/TileTextures/floor.js";
import {drawDoor} from "../assets/TileTextures/door.js";
import {drawWindow} from "../assets/TileTextures/window.js";
import {drawSmartBoard} from "../assets/TileTextures/smartboard.js";
import {drawWhiteBoard} from "../assets/TileTextures/whiteboard.js";
import {drawDesk} from "../assets/TileTextures/desk.js";

// Export makes the file public so other files can see it
const pixelWidth = 36; // How wide each pixel is
const pixelHeight = 36; // How tall each pixel is
// 30x30 = 900 pixels
const rows = 20; // How many rows of pixels there are
const cols = 20; // How many columns of pixels there are

// Checks current location
// Converts x and y into row and col #s
// If row color == 0 its a wall
// Returns true if its a wall false if its not
const map = [
    0.36, 2.18, 3.18, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36,
    0.9,  1.36, 6.18, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 2.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9,  1.36, 6.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 6.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9,  1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.36, 0.36, 0.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 0.36, 0.36, 0.36,
    ];
export function checkCollision(x: number, y: number): boolean {
    // Convert X & Y into Rows & Cols
    let isAWall = false;
    const row = Math.floor(y / pixelHeight);
    const col = Math.floor(x / pixelWidth);
    const convert = row * cols + col;

    if(map[convert] === 0.9 || map[convert] === 0.18 || map[convert] === 0.36 ||
        map[convert] === 3.9 || map[convert] === 3.18 || map[convert] === 3.36 ||
        map[convert] === 6.9 || map[convert] === 6.18 || map[convert] === 6.36){
        isAWall = true;
    }

    return isAWall;
}

export function drawMap(mapCtx: CanvasRenderingContext2D | null) {
    const tileTextures: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void } = {
        0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
        0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
        0.36:  (ctx, x, y, w, h) => drawWall(360, ctx, x, y, w, h),

        1.9: (ctx, x, y, w, h) => drawFloor(90, ctx, x, y, w, h),
        1.18: (ctx, x, y, w, h) => drawFloor(180, ctx, x, y, w, h),
        1.36:  (ctx, x, y, w, h) => drawFloor(360, ctx, x, y, w, h),

        2.9: (ctx, x, y, w, h) => drawDoor(90, ctx, x, y, w, h),
        2.18: (ctx, x, y, w, h) => drawDoor(180, ctx, x, y, w, h),
        2.36:  (ctx, x, y, w, h) => drawDoor(360, ctx, x, y, w, h),

        3.9: (ctx, x, y, w, h) => drawWindow(90, ctx, x, y, w, h),
        3.18: (ctx, x, y, w, h) => drawWindow(180, ctx, x, y, w, h),
        3.36:  (ctx, x, y, w, h) => drawWindow(360, ctx, x, y, w, h),

        4.9: (ctx, x, y, w, h) => drawSmartBoard(90, ctx, x, y, w, h),
        4.18: (ctx, x, y, w, h) => drawSmartBoard(180, ctx, x, y, w, h),
        4.36:  (ctx, x, y, w, h) => drawSmartBoard(360, ctx, x, y, w, h),

        5.9: (ctx, x, y, w, h) => drawWhiteBoard(90, ctx, x, y, w, h),
        5.18: (ctx, x, y, w, h) => drawWhiteBoard(180, ctx, x, y, w, h),
        5.36:  (ctx, x, y, w, h) => drawWhiteBoard(360, ctx, x, y, w, h),

        6.9: (ctx, x, y, w, h) => drawDesk(90, ctx, x, y, w, h),
        6.18: (ctx, x, y, w, h) => drawDesk(180, ctx, x, y, w, h),
        6.36:  (ctx, x, y, w, h) => drawDesk(360, ctx, x, y, w, h)
    };
    // So this for loop basically goes and makes the map from 1D -> 2D
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;

            tileTextures[map[index]]?.(mapCtx, tileX, tileY, pixelWidth, pixelHeight);
        }
    }
}
