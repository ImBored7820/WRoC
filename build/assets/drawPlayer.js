export function drawPlayer(ctx, x, y, playerWidth, playerHeight, pattern, colors) {
    let cols = 6;
    let rows = 6;
    const pixelWidth = playerWidth / cols;
    const pixelHeight = playerHeight / rows;
    for (let row = 0; row < cols; row++) {
        for (let col = 0; col < rows; col++) {
            const index = row * cols + col;
            const colorNumber = pattern[index];
            const color = colors[colorNumber];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x + col * pixelWidth, y + row * pixelHeight, pixelWidth, pixelHeight);
            }
        }
    }
}
//# sourceMappingURL=drawPlayer.js.map