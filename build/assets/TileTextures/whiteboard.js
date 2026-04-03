import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#b0b0b0",
    1: "#e0e0e0",
    2: "#f0f0f0",
    3: "#d8d8d8",
    4: "#999999"
};
const pattern = [
    4, 4, 4, 4, 4, 4,
    4, 1, 1, 1, 1, 4,
    4, 1, 2, 2, 1, 4,
    4, 1, 2, 2, 1, 4,
    4, 3, 3, 3, 3, 4,
    4, 4, 4, 4, 4, 4
];
export function drawWhiteBoard(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=whiteboard.js.map