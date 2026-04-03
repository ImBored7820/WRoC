import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#5a3d2b",
    1: "#7a5438",
    2: "#8c6342",
    3: "#6e4a32",
    4: "#4e3020"
};
const pattern = [
    4, 4, 0, 0, 4, 4,
    4, 1, 1, 1, 1, 4,
    0, 1, 2, 2, 1, 0,
    0, 1, 3, 3, 1, 0,
    4, 1, 1, 1, 1, 4,
    4, 4, 0, 0, 4, 4
];
export function drawDesk(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=desk.js.map