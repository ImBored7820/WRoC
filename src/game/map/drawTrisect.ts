/**
 * Author: musa -
 * Date: 05/17/2026
 * Time: 21:50:23
 *
 * Description: Describe what the file does
 * Info: WRoC | drawTrisect.ts | WebStorm
 */

import {colors} from "../collisionlogic.js";
import {registerRoom} from "./roomRegistry.js";

// Export makes the file public so other files can see it
const pixelWidth = 36; // How wide each pixel is
const pixelHeight = 36; // How tall each pixel is
// 30x30 = 900 pixels
const rows = 20; // How many rows of pixels there are
const cols = 20; // How many columns of pixels there are

const roomPixelArea = cols * pixelWidth;

export const defaultPattern = [
    0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.36,0,0,0.9,
    2.36,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2.36,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.9,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.9,
    0.27,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.27,
    0.18,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0.18,
    0.9,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.9,
];

export function drawTrisect(ctx: CanvasRenderingContext2D, x: number, y: number,
                            roomOnePattern?: number[], roomOneColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void },
                            roomTwoPattern?: number[], roomTwoColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void },
                            roomThreePattern?: number[], roomThreeColors?: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void }) {


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

function oneToTwoDimensional(ctx: CanvasRenderingContext2D, x: number, y: number, pattern: number[], color: { [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void }) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;

            color[pattern[index]]?.(ctx, tileX+x, tileY+y, pixelWidth, pixelHeight);
        }
    }
}