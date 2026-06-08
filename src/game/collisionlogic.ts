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

// each tile is 36x36 pixels on screen
const pixelWidth = 36;
const pixelHeight = 36;

// this maps tile numbers to their drawing functions
// the decimal part tells us rotation: .9=90deg, .18=180deg, .27=270deg, .36=360deg
export const colors: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void } = {
    // walls in different orientations
    0: (ctx, x, y, w, h) => drawWall(0, ctx, x, y, w, h),
    0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
    0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
    0.27:  (ctx, x, y, w, h) => drawWall(270, ctx, x, y, w, h),

    // floors (basically walkable areas)
    1: (ctx, x, y, w, h) => drawFloor(360, ctx, x, y, w, h),

    1.9: (ctx, x, y, w, h) => drawFloor(90, ctx, x, y, w, h),
    1.18: (ctx, x, y, w, h) => drawFloor(180, ctx, x, y, w, h),
    1.36:  (ctx, x, y, w, h) => drawFloor(360, ctx, x, y, w, h),

    // doors - probably walkable when open
    2.9: (ctx, x, y, w, h) => drawDoor(90, ctx, x, y, w, h),
    2.18: (ctx, x, y, w, h) => drawDoor(180, ctx, x, y, w, h),
    2.36:  (ctx, x, y, w, h) => drawDoor(360, ctx, x, y, w, h),

    // windows - solid, can't walk through them
    3.9: (ctx, x, y, w, h) => drawWindow(90, ctx, x, y, w, h),
    3.18: (ctx, x, y, w, h) => drawWindow(180, ctx, x, y, w, h),
    3.36:  (ctx, x, y, w, h) => drawWindow(360, ctx, x, y, w, h),

    // smartboards
    4.9: (ctx, x, y, w, h) => drawSmartBoard(90, ctx, x, y, w, h),
    4.18: (ctx, x, y, w, h) => drawSmartBoard(180, ctx, x, y, w, h),
    4.36:  (ctx, x, y, w, h) => drawSmartBoard(360, ctx, x, y, w, h),

    // whiteboards
    5.9: (ctx, x, y, w, h) => drawWhiteBoard(90, ctx, x, y, w, h),
    5.18: (ctx, x, y, w, h) => drawWhiteBoard(180, ctx, x, y, w, h),
    5.36:  (ctx, x, y, w, h) => drawWhiteBoard(360, ctx, x, y, w, h),

    // desks - solid objects you can't walk through
    6.9: (ctx, x, y, w, h) => drawDesk(90, ctx, x, y, w, h),
    6.18: (ctx, x, y, w, h) => drawDesk(180, ctx, x, y, w, h),
    6.36:  (ctx, x, y, w, h) => drawDesk(360, ctx, x, y, w, h),

    // lockers - also solid
    7.9: (ctx, x, y, w, h) => drawLocker(90, ctx, x, y, w, h),
    7.18: (ctx, x, y, w, h) => drawLocker(180, ctx, x, y, w, h),
    7.36:  (ctx, x, y, w, h) => drawLocker(360, ctx, x, y, w, h),

    // bulletin boards
    8.9: (ctx, x, y, w, h) => drawBulletinBoard(90, ctx, x, y, w, h),
    8.18: (ctx, x, y, w, h) => drawBulletinBoard(180, ctx, x, y, w, h),
    8.36:  (ctx, x, y, w, h) => drawBulletinBoard(360, ctx, x, y, w, h),
};

// these are the tiles you can't walk through - notice doors aren't in here
const solidTiles = new Set<number>([
    0, 0.9, 0.18, 0.27,        // all walls
    3.9, 3.18, 3.36,           // windows
    6.9, 6.18, 6.36,           // desks
    7.9, 7.18, 7.36,           // lockers
]);

// checks if a specific point is blocked by a solid tile
export function isPointSolid(x: number, y: number): boolean {
    // we need to check all rooms because they can overlap
    for (const room of roomRegistry) {
        // convert world coordinates to room-local coordinates
        const localX = x - room.roomX;
        const localY = y - room.roomY;

        // skip if point is outside this room
        if (localX < 0 || localY < 0) continue;

        // figure out which tile this point is in
        const col = Math.floor(localX / pixelWidth);
        const row = Math.floor(localY / pixelHeight);

        // still outside the room bounds
        if (col >= room.cols || row >= room.rows) continue;

        // get the tile type at this position
        const tileValue = room.patterns[row * room.cols + col];
        // if this tile is solid, the point is blocked
        if (solidTiles.has(tileValue)) return true;
    }
    return false; // no solid tiles found at this point
}

// checks if a rectangular area would collide with any solid tiles
// we check multiple points around the rectangle to be thorough
export function checkRectCollision(x: number, y: number, w: number, h: number): boolean {
    const mx = x + w / 2; // horizontal center of rectangle
    const my = y + h / 2; // vertical center of rectangle
    return (
        // check all four corners
        isPointSolid(x,         y        ) ||  // top-left
        isPointSolid(x + w - 1, y        ) ||  // top-right
        isPointSolid(x,         y + h - 1) ||  // bottom-left
        isPointSolid(x + w - 1, y + h - 1) ||  // bottom-right
        // also check midpoints of each side to catch narrow obstacles
        isPointSolid(mx,        y        ) ||  // top-middle
        isPointSolid(mx,        y + h - 1) ||  // bottom-middle
        isPointSolid(x,         my       ) ||  // left-middle
        isPointSolid(x + w - 1, my       )     // right-middle
    );
}