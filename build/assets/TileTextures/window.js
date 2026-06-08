import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#6a8caf",
    1: "#89b4d4",
    2: "#a8d0ee",
    3: "#78a0c2",
    4: "#888890",
    5: "#e8f2fa",
};
const pattern360 = [
    4, 4, 4, 4, 4, 4,
    4, 5, 1, 2, 5, 4,
    4, 0, 4, 4, 3, 4,
    4, 3, 4, 4, 0, 4,
    4, 5, 2, 1, 5, 4,
    4, 4, 4, 4, 4, 4,
];
const pattern90 = [
    4, 4, 4, 4, 4, 4,
    4, 5, 0, 3, 5, 4,
    4, 1, 4, 4, 2, 4,
    4, 2, 4, 4, 1, 4,
    4, 5, 3, 0, 5, 4,
    4, 4, 4, 4, 4, 4,
];
const pattern180 = [
    4, 4, 4, 4, 4, 4,
    4, 5, 2, 1, 5, 4,
    4, 0, 4, 4, 3, 4,
    4, 3, 4, 4, 0, 4,
    4, 5, 1, 2, 5, 4,
    4, 4, 4, 4, 4, 4,
];
export function drawWindow(degree, ctx, x, y, tileWidth, tileHeight) {
    if (degree == 90)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern90, colors, rows, cols);
    else if (degree == 180)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern180, colors, rows, cols);
    else if (degree == 360)
        drawTile(ctx, x, y, tileWidth, tileHeight, pattern360, colors, rows, cols);
}
//# sourceMappingURL=window.js.map