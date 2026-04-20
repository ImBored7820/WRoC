import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#000000",
    1: "#0a0a0c",
    2: "#0f0f14",
    3: "#060608"
};
const pattern360 = [
    1, 1, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0,
    1, 2, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 2, 1,
    0, 0, 0, 0, 0, 0,
];
const pattern90 = [
    0, 1, 0, 1, 0, 1,
    0, 1, 0, 2, 0, 1,
    0, 0, 0, 1, 0, 1,
    0, 1, 0, 1, 0, 0,
    0, 2, 0, 1, 0, 1,
    0, 1, 0, 0, 0, 1,
];
const pattern180 = [
    0, 0, 0, 0, 0, 0,
    1, 2, 1, 0, 1, 1,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 2, 1,
    0, 0, 0, 0, 0, 0,
    1, 1, 0, 1, 1, 1,
];
export function drawWall(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=wall.js.map