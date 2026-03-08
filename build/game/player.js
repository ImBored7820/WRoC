import { checkCollision } from "./map.js";
var SubStats;
(function (SubStats) {
    SubStats[SubStats["Speed"] = 8] = "Speed";
    SubStats[SubStats["Health"] = 100] = "Health";
    SubStats[SubStats["Stamina"] = 100] = "Stamina";
})(SubStats || (SubStats = {}));
export class Player {
    x;
    y;
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
        this.sprite.src = "./assets/sprite.png";
    }
    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key));
        window.addEventListener("keyup", e => this.keys.delete(e.key));
    }
    update() {
        if (!checkCollision(this.x, this.y)) {
            if (this.keys.has("w"))
                this.y -= SubStats.Speed;
            if (this.keys.has("W"))
                this.y -= SubStats.Speed + this.body / 2;
            if (this.keys.has("ArrowUp"))
                this.y -= SubStats.Speed;
            if (this.keys.has("s"))
                this.y += SubStats.Speed;
            if (this.keys.has("S"))
                this.y += SubStats.Speed + this.body / 2;
            if (this.keys.has("ArrowDown"))
                this.y += SubStats.Speed;
            if (this.keys.has("a"))
                this.x -= SubStats.Speed;
            if (this.keys.has("A"))
                this.x -= SubStats.Speed + this.body / 2;
            if (this.keys.has("ArrowLeft"))
                this.x -= SubStats.Speed;
            if (this.keys.has("d"))
                this.x += SubStats.Speed;
            if (this.keys.has("D"))
                this.x += SubStats.Speed + this.body / 2;
            if (this.keys.has("ArrowRight"))
                this.x += SubStats.Speed;
        }
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, 60, 60);
    }
}
//# sourceMappingURL=player.js.map