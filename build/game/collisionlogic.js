import { defaultPattern } from "./map/drawTrisect.js";
import { drawWall } from "../assets/TileTextures/wall.js";
import { drawFloor } from "../assets/TileTextures/floor.js";
import { drawDoor } from "../assets/TileTextures/door.js";
import { drawWindow } from "../assets/TileTextures/window.js";
import { drawSmartBoard } from "../assets/TileTextures/smartboard.js";
import { drawWhiteBoard } from "../assets/TileTextures/whiteboard.js";
import { drawDesk } from "../assets/TileTextures/desk.js";
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;
export const colors = {
    0.9: (ctx, x, y, w, h) => drawWall(90, ctx, x, y, w, h),
    0.18: (ctx, x, y, w, h) => drawWall(180, ctx, x, y, w, h),
    0.36: (ctx, x, y, w, h) => drawWall(360, ctx, x, y, w, h),
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
export function checkCollision(x, y) {
    let isAWall = false;
    const row = Math.floor(y / pixelHeight);
    const col = Math.floor(x / pixelWidth);
    const convert = row * cols + col;
    if (defaultPattern[convert] === 0.9 || defaultPattern[convert] === 0.18 || defaultPattern[convert] === 0.36 ||
        defaultPattern[convert] === 3.9 || defaultPattern[convert] === 3.18 || defaultPattern[convert] === 3.36 ||
        defaultPattern[convert] === 6.9 || defaultPattern[convert] === 6.18 || defaultPattern[convert] === 6.36) {
        isAWall = true;
    }
    return isAWall;
}
//# sourceMappingURL=collisionlogic.js.map