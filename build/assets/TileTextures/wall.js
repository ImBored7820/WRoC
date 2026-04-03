import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "black",
    1: "darkgray",
    2: "gray"
};
const pattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 0,
    2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2
];
export function drawWall(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=wall.js.map