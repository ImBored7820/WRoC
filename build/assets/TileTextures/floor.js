import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#3a3a3e",
    1: "#3e3e42",
    2: "#424247",
    3: "#2e2e33",
    4: "#353538"
};
const pattern = [
    0, 1, 1, 1, 1, 0,
    3, 0, 1, 1, 0, 3,
    3, 1, 2, 2, 1, 3,
    3, 1, 2, 2, 1, 3,
    3, 0, 1, 1, 0, 3,
    0, 4, 4, 4, 4, 0
];
export function drawFloor(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=floor.js.map