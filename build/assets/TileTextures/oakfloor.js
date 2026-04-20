import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#8a6a42",
    1: "#9a7652",
    2: "#a88864",
    3: "#6a4a2a",
    4: "#7e5a38"
};
const pattern360 = [
    2, 1, 2, 1, 2, 1,
    1, 1, 4, 1, 1, 1,
    3, 3, 3, 3, 3, 3,
    1, 2, 1, 1, 2, 1,
    4, 1, 1, 4, 1, 1,
    3, 3, 3, 3, 3, 3,
];
const pattern90 = [
    3, 4, 1, 3, 1, 2,
    3, 1, 2, 3, 1, 1,
    3, 1, 1, 3, 4, 2,
    3, 4, 1, 3, 1, 1,
    3, 1, 2, 3, 1, 2,
    3, 1, 1, 3, 1, 1,
];
const pattern180 = [
    3, 3, 3, 3, 3, 3,
    1, 1, 4, 1, 1, 4,
    1, 2, 1, 1, 2, 1,
    3, 3, 3, 3, 3, 3,
    1, 1, 1, 4, 1, 1,
    1, 2, 1, 2, 1, 2,
];
export function drawOakFloor(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=oakfloor.js.map