import { drawTile } from "./tileTemplate.js";
const rows = 6;
const cols = 6;
const colors = {
    0: "#5c2a0e",
    1: "#7a3b1a",
    2: "#8f4c28",
    3: "#6b3214",
    4: "#4a2008"
};
const pattern = [
    4, 0, 0, 0, 0, 4,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 1, 0,
    0, 1, 2, 3, 1, 0,
    0, 1, 1, 1, 1, 0,
    4, 0, 0, 0, 0, 4
];
export function drawDoor(ctx, x, y, tileWidth, tileHeight) {
    drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols);
}
//# sourceMappingURL=door.js.map