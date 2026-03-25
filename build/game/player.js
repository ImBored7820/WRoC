import { checkCollision } from "./map.js";
import { playerClasses } from "./playerClasses.js";
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
    level;
    xp;
    xpToNextLevel;
    mind;
    body;
    soul;
    extraStatPoints;
    showClassSelect;
    classChosen;
    playerClass;
    sprite = new Image();
    keys = new Set();
    constructor(x, y, level, MBS) {
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
        this.extraStatPoints = 0;
        this.sprite.src = "./assets/sprite.png";
        this.playerSize = 50;
        this.xp = 0;
        if (level && level > 0)
            this.level = level;
        else
            this.level = 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);
        this.showClassSelect = false;
        this.classChosen = false;
        this.playerClass = null;
    }
    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup", e => this.keys.delete(e.key.toLowerCase()));
    }
    update() {
        if (this.showClassSelect)
            return;
        let dx = 0;
        let dy = 0;
        const shiftHeld = this.keys.has("shift");
        const speedBoost = shiftHeld ? this.body / 2 : 0;
        if (this.keys.has("w") || this.keys.has("arrowup"))
            dy -= SubStats.Speed + speedBoost;
        if (this.keys.has("s") || this.keys.has("arrowdown"))
            dy += SubStats.Speed + speedBoost;
        if (this.keys.has("a") || this.keys.has("arrowleft"))
            dx -= SubStats.Speed + speedBoost;
        if (this.keys.has("d") || this.keys.has("arrowright"))
            dx += SubStats.Speed + speedBoost;
        const newX = this.x + dx;
        if (!checkCollision(newX, this.y) && !checkCollision(newX + this.playerSize - 15, this.y) &&
            !checkCollision(newX, this.y + this.playerSize - 15) &&
            !checkCollision(newX + this.playerSize - 15, this.y + this.playerSize - 15)) {
            this.x = newX;
        }
        const newY = this.y + dy;
        if (!checkCollision(this.x, newY) && !checkCollision(this.x + this.playerSize - 15, newY) &&
            !checkCollision(this.x, newY + this.playerSize - 15) &&
            !checkCollision(this.x + this.playerSize - 15, newY + this.playerSize - 15)) {
            this.y = newY;
        }
    }
    gainXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = 100 * Math.pow(2, this.level);
            if (this.level >= 5 && !this.classChosen) {
                this.showClassSelect = true;
            }
        }
    }
    selectClass(choice) {
        this.playerClass = new playerClasses(choice, this, this.level);
        this.classChosen = true;
        this.showClassSelect = false;
    }
    draw(ctx) {
        ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
    }
}
//# sourceMappingURL=player.js.map