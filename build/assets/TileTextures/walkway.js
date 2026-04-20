import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#808080",
    1: "#8a8a8a",
    2: "#969696",
    3: "#606060",
    4: "#757575"
};
const pattern360 = [
    1, 2, 1, 1, 4, 1,
    2, 1, 4, 2, 1, 2,
    1, 4, 1, 1, 2, 4,
    3, 3, 3, 3, 3, 3,
    4, 1, 2, 1, 1, 2,
    1, 2, 1, 4, 2, 1,
];
const pattern90 = [
    1, 4, 3, 1, 2, 1,
    2, 1, 3, 4, 1, 2,
    1, 2, 3, 1, 4, 1,
    4, 1, 3, 1, 2, 1,
    2, 1, 3, 2, 1, 4,
    1, 2, 3, 4, 2, 1,
];
const pattern180 = [
    1, 2, 4, 1, 2, 1,
    2, 1, 1, 2, 1, 4,
    3, 3, 3, 3, 3, 3,
    4, 2, 1, 1, 4, 1,
    2, 1, 2, 4, 1, 2,
    1, 4, 1, 1, 2, 1,
];
export function drawWalkway(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=walkway.js.map