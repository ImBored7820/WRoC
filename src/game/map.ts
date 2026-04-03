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

/*
This map is the reason above the numbers are mapped to colors; each reference
to a number corresponds to 1 pixel on the screen of the color the number is
the map is actually in 1D to reduce loading time
 */
const map = [
    0, 2, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    5, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
];
// Checks current location
// Converts x and y into row and col #s
// If row color == 0 its a wall
// Returns true if its a wall false if its not

export function checkCollision(x: number, y: number): boolean {
    // Convert X & Y into Rows & Cols
    let isAWall = false;
    const row = Math.floor(y / pixelHeight);
    const col = Math.floor(x / pixelWidth);
    const convert = row * cols + col;

    if(map[convert] === 0 || map[convert] === 3 || map[convert] === 6){
        isAWall = true;
    }

    return isAWall;
}

export function drawMap(mapCtx: CanvasRenderingContext2D | null) {
    const tileTextures: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void } = {
        0: drawWall,
        1: drawFloor,
        2: drawDoor,
        3: drawWindow,
        4: drawSmartBoard,
        5: drawWhiteBoard,
        6: drawDesk,
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