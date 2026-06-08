/**
 * Author: musa -
 * Date: 05/17/2026
 *
 * Description: Tile collision and rendering dispatch
 * Info: WRoC | collisionlogic.ts | WebStorm
 */
import {drawWall} from "../assets/TileTextures/wall.js";
import {drawFloor} from "../assets/TileTextures/floor.js";
import {drawDoor} from "../assets/TileTextures/door.js";
import {drawWindow} from "../assets/TileTextures/window.js";
import {drawSmartBoard} from "../assets/TileTextures/smartboard.js";
import {drawWhiteBoard} from "../assets/TileTextures/whiteboard.js";
import {drawDesk} from "../assets/TileTextures/desk.js";
import {drawLocker} from "../assets/TileTextures/locker.js";
import {drawBulletinBoard} from "../assets/TileTextures/bulletinBoard.js";
import {roomRegistry} from "./map/roomRegistry.js";

const pixelWidth = 36;
const pixelHeight = 36;

export const colors: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void } = {
    0: (ctx, x, y, w, h) => drawWall(0, ctx, x, y, w, h),
    0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
    0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
    0.27:  (ctx, x, y, w, h) => drawWall(270, ctx, x, y, w, h),

    1: (ctx, x, y, w, h) => drawFloor(360, ctx, x, y, w, h),

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
    6.36:  (ctx, x, y, w, h) => drawDesk(360, ctx, x, y, w, h),

    7.9: (ctx, x, y, w, h) => drawLocker(90, ctx, x, y, w, h),
    7.18: (ctx, x, y, w, h) => drawLocker(180, ctx, x, y, w, h),
    7.36:  (ctx, x, y, w, h) => drawLocker(360, ctx, x, y, w, h),

    8.9: (ctx, x, y, w, h) => drawBulletinBoard(90, ctx, x, y, w, h),
    8.18: (ctx, x, y, w, h) => drawBulletinBoard(180, ctx, x, y, w, h),
    8.36:  (ctx, x, y, w, h) => drawBulletinBoard(360, ctx, x, y, w, h),
};

const solidTiles = new Set<number>([
    0, 0.9, 0.18, 0.27,
    3.9, 3.18, 3.36,
    6.9, 6.18, 6.36,
    7.9, 7.18, 7.36,
]);

export function isPointSolid(x: number, y: number): boolean {
    // With overlapping rooms, check every room that contains this point
    for (const room of roomRegistry) {
        const localX = x - room.roomX;
        const localY = y - room.roomY;

        if (localX < 0 || localY < 0) continue;

        const col = Math.floor(localX / pixelWidth);
        const row = Math.floor(localY / pixelHeight);

        if (col >= room.cols || row >= room.rows) continue;

        const tileValue = room.patterns[row * room.cols + col];
        if (solidTiles.has(tileValue)) return true;
    }
    return false;
}

export function checkRectCollision(x: number, y: number, w: number, h: number): boolean {
    const mx = x + w / 2; // horizontal midpoint
    const my = y + h / 2; // vertical midpoint
    return (
        isPointSolid(x,         y        ) ||  // top-left
        isPointSolid(x + w - 1, y        ) ||  // top-right
        isPointSolid(x,         y + h - 1) ||  // bottom-left
        isPointSolid(x + w - 1, y + h - 1) ||  // bottom-right
        isPointSolid(mx,        y        ) ||  // top-mid
        isPointSolid(mx,        y + h - 1) ||  // bottom-mid
        isPointSolid(x,         my       ) ||  // left-mid
        isPointSolid(x + w - 1, my       )     // right-mid
    );
}
