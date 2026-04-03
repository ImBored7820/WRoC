import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#8f2e2e",
    1: "#813c3c",
    2: "#2c0c0c"
};
const pattern = [
    0, 1, 1, 1, 1, 0,
    1, 1, 2, 2, 1, 1,
    1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 1, 1,
    0, 1, 1, 1, 1, 0
];
export function drawDoor(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=door.js.map