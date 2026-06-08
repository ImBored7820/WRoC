import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#584818",
    1: "#786030",
    2: "#a08048",
    3: "#c0a060",
};
const pattern0 = [
    0, 0, 0, 0, 0, 0,
    2, 3, 2, 3, 2, 3,
    0, 0, 0, 0, 0, 0,
    3, 2, 3, 2, 3, 2,
    1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0,
];
const pattern90 = [
    0, 2, 0, 3, 0, 2,
    0, 3, 0, 2, 0, 3,
    0, 0, 0, 0, 0, 0,
    0, 2, 0, 3, 0, 2,
    0, 3, 0, 2, 0, 3,
    1, 1, 1, 1, 1, 1,
];
const pattern180 = [
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 3, 2, 3, 2, 3,
    0, 0, 0, 0, 0, 0,
    3, 2, 3, 2, 3, 2,
    0, 0, 0, 0, 0, 0,
];
const pattern270 = [
    1, 1, 1, 1, 1, 1,
    2, 0, 3, 0, 2, 0,
    3, 0, 2, 0, 3, 0,
    0, 0, 0, 0, 0, 0,
    2, 0, 3, 0, 2, 0,
    3, 0, 2, 0, 3, 0,
];
export function drawWall(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 0)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern0, colors, rows, cols);
    else if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 270)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern270, colors, rows, cols);
}
//# sourceMappingURL=wall.js.map