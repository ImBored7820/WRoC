import { drawWall } from "../../assets/TileTextures/wall.js";
import { drawFloor } from "../../assets/TileTextures/floor.js";
import { drawDoor } from "../../assets/TileTextures/door.js";
import { drawWindow } from "../../assets/TileTextures/window.js";
import { drawSmartBoard } from "../../assets/TileTextures/smartboard.js";
import { drawWhiteBoard } from "../../assets/TileTextures/whiteboard.js";
import { drawDesk } from "../../assets/TileTextures/desk.js";
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;
const defaultPattern = [
    0.36, 2.18, 3.18, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36, 0.36,
    0.9, 1.36, 6.18, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 2.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    4.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    5.9, 1.36, 6.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 6.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.9, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 1.36, 0.9,
    0.36, 0.36, 0.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 3.36, 0.36, 0.36, 0.36,
];
const defaultColors = {
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
export function drawTrisect(ctx, x, y, roomOnePattern, roomOneColors, roomTwoPattern, roomTwoColors, roomThreePattern, roomThreeColors) {
    if (roomOnePattern && roomOneColors) {
        oneToTwoDimensional(ctx, x, y, roomOnePattern, roomOneColors);
    }
    else {
        oneToTwoDimensional(ctx, x, y, defaultPattern, defaultColors);
    }
    if (roomTwoPattern && roomTwoColors) {
        oneToTwoDimensional(ctx, x, y, roomTwoPattern, roomTwoColors);
    }
    else {
        oneToTwoDimensional(ctx, x, y, defaultPattern, defaultColors);
    }
    if (roomThreePattern && roomThreeColors) {
        oneToTwoDimensional(ctx, x, y, roomThreePattern, roomThreeColors);
    }
    else {
        oneToTwoDimensional(ctx, x, y, defaultPattern, defaultColors);
    }
}
function oneToTwoDimensional(ctx, x, y, pattern, color) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;
            color[pattern[index]]?.(ctx, tileX + x, tileY + y, pixelWidth, pixelHeight);
        }
    }
}
//# sourceMappingURL=drawTrisecnt.js.map