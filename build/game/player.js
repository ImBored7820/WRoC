import { checkCollision } from "./map.js";
var SubStats;
(function (SubStats) {
    SubStats[SubStats["Speed"] = 6] = "Speed";
    SubStats[SubStats["Health"] = 100] = "Health";
    SubStats[SubStats["Stamina"] = 100] = "Stamina";
})(SubStats || (SubStats = {}));
export class Player {
    x;
    y;
    playerSize;
    mind;
    body;
    soul;
    sprite = new Image();
    keys = new Set();
    constructor(x, y, MBS) {
        this.x = x;
        this.y = y;
        if (MBS && MBS < 100)
            MBS = 111;
        else if (!MBS)
            MBS = 111;
        let mbsToString = MBS.toString();
        let temp = mbsToString.split('').map(Number);
        this.mind = temp[0];
        this.body = temp[1];
        this.soul = temp[2];
        this.sprite.src = "./assets/pikaa.png";
        this.playerSize = 50;
    }
    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key));
        window.addEventListener("keyup", e => this.keys.delete(e.key));
    }
    update() {
        let dx = 0;
        let dy = 0;
        if (this.keys.has("w"))
            dy -= SubStats.Speed;
        if (this.keys.has("W"))
            dy -= SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowUp"))
            dy -= SubStats.Speed;
        if (this.keys.has("s"))
            dy += SubStats.Speed;
        if (this.keys.has("S"))
            dy += SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowDown"))
            dy += SubStats.Speed;
        if (this.keys.has("a"))
            dx -= SubStats.Speed;
        if (this.keys.has("A"))
            dx -= SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowLeft"))
            dx -= SubStats.Speed;
        if (this.keys.has("d"))
            dx += SubStats.Speed;
        if (this.keys.has("D"))
            dx += SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowRight"))
            dx += SubStats.Speed;
        const newX = this.x + dx;
        if (!checkCollision(newX, this.y) && !checkCollision(newX + this.playerSize - 1, this.y) &&
            !checkCollision(newX, this.y + this.playerSize - 1) &&
            !checkCollision(newX + this.playerSize - 1, this.y + this.playerSize - 1)) {
            this.x = newX;
        }
        const newY = this.y + dy;
        if (!checkCollision(this.x, newY) && !checkCollision(this.x + this.playerSize - 1, newY) &&
            !checkCollision(this.x, newY + this.playerSize - 1) &&
            !checkCollision(this.x + this.playerSize - 1, newY + this.playerSize - 1)) {
            this.y = newY;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
        if (ctx) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
            ctx.fill();
        }
    }
}
//# sourceMappingURL=player.js.map