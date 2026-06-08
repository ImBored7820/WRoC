import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#382010",
    1: "#503018",
    2: "#684020",
    3: "#886030",
    4: "#a8c8e8",
    5: "#c8a040",
};
const pattern360 = [
    0, 0, 0, 0, 0, 0,
    0, 4, 4, 4, 4, 0,
    0, 2, 2, 2, 3, 0,
    0, 2, 2, 2, 3, 0,
    0, 1, 1, 5, 1, 0,
    0, 0, 0, 0, 0, 0,
];
const pattern90 = [
    0, 0, 0, 0, 0, 0,
    0, 4, 2, 2, 1, 0,
    0, 4, 2, 2, 1, 0,
    0, 4, 3, 3, 5, 0,
    0, 4, 2, 2, 1, 0,
    0, 0, 0, 0, 0, 0,
];
const pattern180 = [
    0, 0, 0, 0, 0, 0,
    0, 1, 5, 1, 1, 0,
    0, 3, 2, 2, 2, 0,
    0, 3, 2, 2, 2, 0,
    0, 4, 4, 4, 4, 0,
    0, 0, 0, 0, 0, 0,
];
export function drawDoor(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=door.js.map