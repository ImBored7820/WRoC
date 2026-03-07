export class Player {
    x = 300;
    y = 300;
    speed = 5;
    sprite = new Image();
    keys = new Set();
    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key));
        window.addEventListener("keyup", e => this.keys.delete(e.key));
    }
    update() {
        if (this.keys.has("w"))
            this.y -= this.speed;
        if (this.keys.has("W"))
            this.y -= this.speed + 3;
        if (this.keys.has("ArrowUp"))
            this.y -= this.speed;
        if (this.keys.has("s"))
            this.y += this.speed;
        if (this.keys.has("S"))
            this.y += this.speed + 3;
        if (this.keys.has("ArrowDown"))
            this.y += this.speed;
        if (this.keys.has("a"))
            this.x -= this.speed;
        if (this.keys.has("A"))
            this.x -= this.speed + 3;
        if (this.keys.has("ArrowLeft"))
            this.x -= this.speed;
        if (this.keys.has("d"))
            this.x += this.speed;
        if (this.keys.has("D"))
            this.x += this.speed + 3;
        if (this.keys.has("ArrowRight"))
            this.x += this.speed;
    }
    draw(ctx) {
        this.sprite.src = "./assets/sprite.png";
        ctx.drawImage(this.sprite, this.x, this.y, 100, 100);
    }
}
//# sourceMappingURL=player.js.map