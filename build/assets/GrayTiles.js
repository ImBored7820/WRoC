/**
 * Author: Musa Ali
 * Date: 03/06/2026
 * Time: 08:29:32
 *
 * Description: Describe what the file does
 * Info: WRoC | GrayTiles.ts | WebStorm
 */
export const tileWidth = 20;
const tileHeight = 20;
const rows = 5;
const cols = 5;
const pixelColors = {
    0: "gray",
    1: "silver",
    2: "lightgray",
};
const grayTile = [
    0, 0, 0, 0, 0,
    1, 1, 1, 1, 1,
    2, 2, 2, 2, 2,
    1, 1, 1, 1, 1,
    0, 0, 0, 0, 0,
];
function drawTile(mapCtx) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            //mapCtx.draw
        }
    }
}
