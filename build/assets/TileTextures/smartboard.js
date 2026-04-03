import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#080810",
    1: "#101018",
    2: "#181822",
    3: "#0c0c14",
    4: "#20202c",
};
const pattern = [
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 4, 1, 0,
    0, 1, 4, 2, 1, 0,
    0, 3, 3, 3, 3, 0,
    0, 0, 0, 0, 0, 0,
];
export function drawSmartBoard(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=smartboard.js.map