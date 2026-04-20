import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#d4c4a8",
    1: "#dfd0b8",
    2: "#e8dcc8",
    3: "#a89878",
    4: "#c0b090"
};
const pattern360 = [
    2, 1, 2, 4, 1, 2,
    1, 4, 1, 1, 2, 1,
    3, 3, 3, 3, 3, 3,
    1, 2, 4, 1, 2, 1,
    4, 1, 1, 4, 1, 2,
    3, 3, 3, 3, 3, 3,
];
const pattern90 = [
    3, 4, 1, 3, 1, 2,
    3, 1, 2, 3, 4, 1,
    3, 1, 4, 3, 1, 2,
    3, 4, 1, 3, 1, 4,
    3, 1, 2, 3, 2, 1,
    3, 2, 1, 3, 1, 2,
];
const pattern180 = [
    3, 3, 3, 3, 3, 3,
    2, 1, 4, 1, 1, 4,
    1, 2, 1, 4, 2, 1,
    3, 3, 3, 3, 3, 3,
    1, 2, 1, 1, 4, 1,
    2, 1, 4, 2, 1, 2,
];
export function drawBirchFloor(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=birchfloor.js.map