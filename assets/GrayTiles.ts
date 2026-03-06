/**
 * Author: Musa Ali
 * Date: 03/06/2026
 * Time: 08:29:32
 *
 * Description: Describe what the file does
 * Info: WRoC | GrayTiles.ts | WebStorm
 */
const tileWidth = 20;
const tileHeight = 20;

const rows = 5;
const cols = 5;

const pixelColors = {
    0: "gray",
    1: "silver",
    2: "lightgray",
};

const grayTile = [
    0,0,0,0,0,
    1,1,1,1,1,
    2,2,2,2,2,
    1,1,1,1,1,
    0,0,0,0,0,
]

export function drawTile(mapCtx: CanvasRenderingContext2D | null) {
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            if (!mapCtx) return;
            const index = row * cols + col;
            // @ts-ignore
            mapCtx.fillStyle = pixelColors[grayTile[index]];
            mapCtx.fillRect(col * tileWidth, row * tileHeight, tileWidth, tileHeight);
        }
    }
}






