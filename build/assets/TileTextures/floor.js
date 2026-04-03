import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#555555",
    1: "#666666",
    2: "#777777"
};
const pattern = [
    0, 1, 1, 1, 1, 0,
    1, 1, 2, 2, 1, 1,
    1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 1, 1,
    0, 1, 1, 1, 1, 0
];
export function drawFloor(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=floor.js.map