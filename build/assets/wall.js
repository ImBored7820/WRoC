const pixelWidth = 1;
const pixelHeight = 1;
const rows = 6;
const cols = 6;
const pixelColors = {
    0: "black",
    1: "darkgray",
    2: "gray"
};
const tile = [
    0, 0, 0, 0, 0, 0,
    0, 0, 1, 1, 0, 0.,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2
];
export function drawTiles() {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const tileIndex = pixelWidth * pixelWidth * rows;
        }
    }
}
//# sourceMappingURL=wall.js.map