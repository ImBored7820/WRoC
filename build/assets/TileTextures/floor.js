import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#d8d0b0",
    1: "#c8c0a0",
    2: "#b8b090",
};
const pattern360 = [
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
];
const pattern90 = [
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
];
const pattern180 = [
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 1,
    1, 0, 1, 0, 1, 0,
];
export function drawFloor(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=floor.js.map