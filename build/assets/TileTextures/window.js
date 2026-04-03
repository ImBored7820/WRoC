import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#c9bbbb",
    1: "#e7cece",
    2: "#b4b0b0"
};
const pattern = [
    0, 1, 1, 1, 1, 0,
    1, 1, 2, 2, 1, 1,
    1, 2, 2, 2, 2, 1,
    1, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 1, 1,
    0, 1, 1, 1, 1, 0
];
export function drawWindow(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=window.js.map