import { drawWall } from "../assets/TileTextures/wall.js";
import { drawFloor } from "../assets/TileTextures/floor.js";
import { drawDoor } from "../assets/TileTextures/door.js";
import { drawWindow } from "../assets/TileTextures/window.js";
import { drawSmartBoard } from "../assets/TileTextures/smartboard.js";
import { drawWhiteBoard } from "../assets/TileTextures/whiteboard.js";
import { drawDesk } from "../assets/TileTextures/desk.js";
import { roomRegistry } from "./map/roomRegistry.js";
const pixelWidth = 36;
const pixelHeight = 36;
export const colors = {
    0: (ctx, x, y, w, h) => drawWall(0, ctx, x, y, w, h),
    0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
    0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
    0.27: (ctx, x, y, w, h) => drawWall(270, ctx, x, y, w, h),
    1.9: (ctx, x, y, w, h) => drawFloor(90, ctx, x, y, w, h),
    1.18: (ctx, x, y, w, h) => drawFloor(180, ctx, x, y, w, h),
    1.36: (ctx, x, y, w, h) => drawFloor(360, ctx, x, y, w, h),
    2.9: (ctx, x, y, w, h) => drawDoor(90, ctx, x, y, w, h),
    2.18: (ctx, x, y, w, h) => drawDoor(180, ctx, x, y, w, h),
    2.36: (ctx, x, y, w, h) => drawDoor(360, ctx, x, y, w, h),
    3.9: (ctx, x, y, w, h) => drawWindow(90, ctx, x, y, w, h),
    3.18: (ctx, x, y, w, h) => drawWindow(180, ctx, x, y, w, h),
    3.36: (ctx, x, y, w, h) => drawWindow(360, ctx, x, y, w, h),
    4.9: (ctx, x, y, w, h) => drawSmartBoard(90, ctx, x, y, w, h),
    4.18: (ctx, x, y, w, h) => drawSmartBoard(180, ctx, x, y, w, h),
    4.36: (ctx, x, y, w, h) => drawSmartBoard(360, ctx, x, y, w, h),
    5.9: (ctx, x, y, w, h) => drawWhiteBoard(90, ctx, x, y, w, h),
    5.18: (ctx, x, y, w, h) => drawWhiteBoard(180, ctx, x, y, w, h),
    5.36: (ctx, x, y, w, h) => drawWhiteBoard(360, ctx, x, y, w, h),
    6.9: (ctx, x, y, w, h) => drawDesk(90, ctx, x, y, w, h),
    6.18: (ctx, x, y, w, h) => drawDesk(180, ctx, x, y, w, h),
    6.36: (ctx, x, y, w, h) => drawDesk(360, ctx, x, y, w, h)
};
const solidTiles = new Set([0, 0.9, 0.18, 0.27, 3.9, 3.18, 3.36, 6.9, 6.18, 6.36]);
export function isPointSolid(x, y) {
    let inARoom = false;
    for (const room of roomRegistry) {
        const localX = x - room.roomX;
        const localY = y - room.roomY;
        if (localX < 0 || localY < 0)
            continue;
        const col = Math.floor(localX / pixelWidth);
        const row = Math.floor(localY / pixelHeight);
        if (col >= room.cols || row >= room.rows)
            continue;
        inARoom = true;
        const tileValue = room.patterns[row * room.cols + col];
        if (!solidTiles.has(tileValue))
            return false;
    }
    return true;
}
export function checkRectCollision(x, y, w, h) {
    return (isPointSolid(x, y) ||
        isPointSolid(x + w - 1, y) ||
        isPointSolid(x, y + h - 1) ||
        isPointSolid(x + w - 1, y + h - 1));
}
//# sourceMappingURL=collisionlogic.js.map