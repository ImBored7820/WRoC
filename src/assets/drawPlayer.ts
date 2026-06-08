/**
 * Author: musa -
 * Date: 04/29/2026
 * Time: 12:55:32
 *
 * Description: This file draws the player onto the canvas
 * Info: WRoC | drawPlayer.ts | WebStorm
 */

/* This method takes a ctx tool, position, dimensions as well as the patterns
 * and colors of the player and draws it onto the canvas
 */

export function drawPlayer(ctx: CanvasRenderingContext2D,
                           x: number, y: number, playerWidth: number,
                           playerHeight: number, pattern: number[],
                           colors: { [key: number]: string }) {
    let cols = 6;
    let rows = 6;
    const pixelWidth = playerWidth / cols;
    const pixelHeight = playerHeight / rows;

    for(let row = 0; row < cols; row++) {
        for(let col = 0; col < rows; col++) {
            const index = row * cols + col;
            const colorNumber = pattern[index];
            const color = colors[colorNumber];

            if(color){
                ctx.fillStyle = color;
                ctx.fillRect(x + col * pixelWidth, y + row * pixelHeight, pixelWidth, pixelHeight);
            }
        }
    }
}