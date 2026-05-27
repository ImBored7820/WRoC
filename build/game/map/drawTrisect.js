import { colors } from "../collisionlogic.js";
import { registerRoom } from "./roomRegistry.js";
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;
const roomPixelArea = cols * pixelWidth;
export const defaultPattern = [
    0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2.36, 0, 0, 0.9,
    2.36, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2.36,
    0.18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.18,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.27,
    0.18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.18,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.27,
    0.18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.18,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.27,
    0.18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.18,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.9, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.9,
    0.27, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.27,
    0.18, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0.18,
    0.9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.9,
];
export function drawTrisect(ctx, x, y, roomOnePattern, roomOneColors, roomTwoPattern, roomTwoColors, roomThreePattern, roomThreeColors) {
    const roomOneX = x;
    const roomTwoX = x + roomPixelArea - pixelWidth;
    const roomThreeX = x + (roomPixelArea - pixelWidth) * 2;
    const patternOne = roomOnePattern ?? defaultPattern;
    const patternTwo = roomTwoPattern ?? defaultPattern;
    const patternThree = roomThreePattern ?? defaultPattern;
    const colorOne = roomOneColors ?? colors;
    const colorTwo = roomTwoColors ?? colors;
    const colorThree = roomThreeColors ?? colors;
    oneToTwoDimensional(ctx, roomOneX, y, patternOne, colorOne);
    oneToTwoDimensional(ctx, roomTwoX, y, patternTwo, colorTwo);
    oneToTwoDimensional(ctx, roomThreeX, y, patternThree, colorThree);
    registerRoom(roomOneX, y, cols, rows, patternOne);
    registerRoom(roomTwoX, y, cols, rows, patternTwo);
    registerRoom(roomThreeX, y, cols, rows, patternThree);
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
//# sourceMappingURL=drawTrisect.js.map