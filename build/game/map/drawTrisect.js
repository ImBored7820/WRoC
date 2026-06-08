import { colors } from "../collisionlogic.js";
import { registerRoom } from "./roomRegistry.js";
const pixelWidth = 36;
const pixelHeight = 36;
const rows = 20;
const cols = 20;
const roomPixelArea = cols * pixelWidth;
export function withPassages(pattern) {
    return pattern.map((tile, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        if (row >= 9 && row <= 11 && (col === 0 || col === cols - 1))
            return 1;
        return tile;
    });
}
export const defaultPattern = withPassages([
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
]);
export const roomPattern = defaultPattern;
export function drawTrisect(ctx, x, y, roomOnePattern, roomOneColors, roomTwoPattern, roomTwoColors, roomThreePattern, roomThreeColors, roomTypes) {
    const roomOneX = x;
    const roomTwoX = x + roomPixelArea - pixelWidth;
    const roomThreeX = x + (roomPixelArea - pixelWidth) * 2;
    const patternOne = roomOnePattern ?? defaultPattern;
    const patternTwo = roomTwoPattern ?? defaultPattern;
    const patternThree = roomThreePattern ?? defaultPattern;
    const colorOne = roomOneColors ?? colors;
    const colorTwo = roomTwoColors ?? colors;
    const colorThree = roomThreeColors ?? colors;
    const types = roomTypes ?? ["room", "room", "room"];
    oneToTwoDimensional(ctx, roomOneX, y, patternOne, colorOne);
    oneToTwoDimensional(ctx, roomTwoX, y, patternTwo, colorTwo);
    oneToTwoDimensional(ctx, roomThreeX, y, patternThree, colorThree);
    const id1 = registerRoom(roomOneX, y, cols, rows, patternOne, types[0]);
    const id2 = registerRoom(roomTwoX, y, cols, rows, patternTwo, types[1]);
    const id3 = registerRoom(roomThreeX, y, cols, rows, patternThree, types[2]);
    return { roomIds: [id1, id2, id3] };
}
export const hallwayPattern = withPassages(defaultPattern.map((tile, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    if (row === 0 || row === rows - 1)
        return tile;
    if (col === 0 || col === cols - 1)
        return tile;
    return 1;
}));
export function drawHallway(ctx, x, y, widthTiles, heightTiles = 5) {
    const pattern = [];
    for (let row = 0; row < heightTiles; row++) {
        for (let col = 0; col < widthTiles; col++) {
            const isTop = row === 0;
            const isBot = row === heightTiles - 1;
            const isLeft = col === 0;
            const isRight = col === widthTiles - 1;
            if (isTop)
                pattern.push(isLeft || isRight ? 0.9 : 0);
            else if (isBot)
                pattern.push(isLeft || isRight ? 0.18 : 0);
            else if (isLeft)
                pattern.push(0.27);
            else if (isRight)
                pattern.push(0.9);
            else
                pattern.push(1);
        }
    }
    for (let row = 0; row < heightTiles; row++) {
        for (let col = 0; col < widthTiles; col++) {
            const tileX = col * pixelWidth;
            const tileY = row * pixelHeight;
            colors[pattern[row * widthTiles + col]]?.(ctx, tileX + x, tileY + y, pixelWidth, pixelHeight);
        }
    }
    const roomId = registerRoom(x, y, widthTiles, heightTiles, pattern, "hallway");
    return { roomId };
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