export function drawTile(ctx, x, y, tileWidth, tileHeight, pattern, colors, rows, cols) {
    const pixelW = tileWidth / cols;
    const pixelH = tileHeight / rows;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            ctx.fillStyle = colors[pattern[index]] ?? "black";
            ctx.fillRect(x + col * pixelW, y + row * pixelH, pixelW, pixelH);
        }
    }
}
//# sourceMappingURL=tileTemplate.js.map