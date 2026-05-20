/**
 * Author: musa -
 * Date: 05/17/2026
 * Time: 21:59:28
 *
 * Description: Describe what the file does
 * Info: WRoC | collisionlogic.ts | WebStorm
 */

import {defaultPattern} from "./map/drawTrisect.js";
import {drawWall} from "../assets/TileTextures/wall.js";
import {drawFloor} from "../assets/TileTextures/floor.js";
import {drawDoor} from "../assets/TileTextures/door.js";
import {drawWindow} from "../assets/TileTextures/window.js";
import {drawSmartBoard} from "../assets/TileTextures/smartboard.js";
import {drawWhiteBoard} from "../assets/TileTextures/whiteboard.js";
import {drawDesk} from "../assets/TileTextures/desk.js";
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;

export const colors: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void } = {
    0: (ctx, x, y, w, h) => drawWall(0, ctx, x, y, w, h),
    0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
    0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
    0.27:  (ctx, x, y, w, h) => drawWall(270, ctx, x, y, w, h),

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

const solidTiles = new Set<number>([0, 0.9, 0.18, 0.27, 3.9, 3.18, 3.36, 6.9, 6.18, 6.36]);

export function checkRectCollision(x: number, y: number, w: number, h: number): boolean {
    let leftMostTile = Math.floor(x/pixelWidth);
    let rightMostTile = Math.floor((x+w-1)/pixelWidth);
    let topMostTile = Math.floor(y/pixelHeight);
    let bottomMostTile = Math.floor((y+h-1)/pixelHeight);

    if(topMostTile < 0 || bottomMostTile >= rows || leftMostTile < 0 || rightMostTile >= cols) {
        return true;
    }

    for(let row = topMostTile; row <= bottomMostTile; row++) {
        for(let col = leftMostTile; col <= rightMostTile; col++) {
            let tileIndex = row * cols + col;
            if(solidTiles.has(defaultPattern[tileIndex])) {
                return true;
            }
        }
    }

    return false;
}

export function checkCollision(x: number, y: number): boolean {
    // Convert X & Y into Rows & Cols
    let isAWall = false;
    const row = Math.floor(y / pixelHeight);
    const col = Math.floor(x / pixelWidth);
    const convert = row * cols + col;
    if (row < 0 || row >= rows || col < 0 || col >= cols) return true;
    if(solidTiles.has(defaultPattern[convert])){
        isAWall = true;
    }

    return isAWall;
}
