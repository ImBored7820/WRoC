/**
 * Author: musa -
 * Date: 03/28/2026
 * Time: 17:47:49
 *
 * Description: Describe what the file does
 * Info: WRoC | tileTemplate.ts | WebStorm
 */

export function drawTile(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    tileWidth: number,
    tileHeight: number,
    pattern: number[],
    colors: { [key: number]: string },
    rows: number,
    cols: number
) {
    const pixelHeight = tileWidth / cols;
    const pixelWidth = tileHeight / rows;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            ctx.fillStyle = colors[pattern[index]] ?? "black";
            ctx.fillRect(x + col * pixelHeight, y + row * pixelWidth, pixelHeight, pixelWidth);
        }
    }
}