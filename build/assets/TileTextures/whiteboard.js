import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#b0b0b0",
    1: "#e0e0e0",
    2: "#f0f0f0",
    3: "#d8d8d8",
    4: "#999999",
    5: "#c0c0c0",
    6: "#4a7acc"
};
const pattern360 = [
    4, 4, 4, 4, 4, 4,
    4, 2, 2, 3, 2, 4,
    4, 3, 2, 2, 6, 4,
    4, 2, 2, 3, 2, 4,
    4, 2, 3, 2, 2, 4,
    0, 0, 0, 0, 0, 0,
];
const pattern90 = [
    0, 4, 4, 4, 4, 4,
    0, 2, 2, 3, 2, 4,
    0, 3, 2, 2, 2, 4,
    0, 2, 3, 2, 3, 4,
    0, 2, 2, 6, 2, 4,
    0, 4, 4, 4, 4, 4,
];
const pattern180 = [
    0, 0, 0, 0, 0, 0,
    4, 2, 2, 3, 2, 4,
    4, 2, 3, 2, 2, 4,
    4, 6, 2, 2, 3, 4,
    4, 2, 3, 2, 2, 4,
    4, 4, 4, 4, 4, 4,
];
export function drawWhiteBoard(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=whiteboard.js.map