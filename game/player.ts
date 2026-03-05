export class Player {
    x: number = 300;
    y: number = 300;
    speed: number = 10;
    private sprite: HTMLImageElement = new Image();
    private keys: Set<string> = new Set();


    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup",   e => this.keys.delete(e.key.toLowerCase()));
    }

    update() {
        if (this.keys.has("w")) this.y -= this.speed;
        if (this.keys.has("s")) this.y += this.speed;
        if (this.keys.has("a")) this.x -= this.speed;
        if (this.keys.has("d")) this.x += this.speed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.sprite.src = "sprite.png";
        ctx.drawImage(this.sprite, this.x, this.y, 100, 100);
    }
}


