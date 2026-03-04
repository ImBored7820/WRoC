export class Player {
    // TODO Player should move
    x = 0;
    y = 0;
    speed = 3;
    movementKeys() {
        const keys = new Set();
        window.addEventListener("keydown", e => keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup", e => keys.delete(e.key.toLowerCase()));
        this.keys = keys; // store on instance so update() can read it
    }
    update() {
        if (this.keys.has("w"))
            this.y -= this.speed;
        if (this.keys.has("s"))
            this.y += this.speed;
        if (this.keys.has("a"))
            this.x -= this.speed;
        if (this.keys.has("d"))
            this.x += this.speed;
    }
    draw(ctx) {
        const sprite = new Image();
        sprite.src = "sprite.png";
        ctx.drawImage(sprite, this.x, this.y, 80, 80);
    }
    keys = new Set();
}
