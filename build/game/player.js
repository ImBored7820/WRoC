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
    name;
    level;
    xp;
    xpToNextLevel;
    health;
    maxHealth;
    stamina;
    maxStamina;
    mind;
    body;
    soul;
    extraStatPoints;
    classSelect;
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
        this.sprite.src = "./src/assets/sprite.png";
        this.playerSize = 30;
        this.name = "Player";
        this.maxHealth = SubStats.Health;
        this.health = this.maxHealth;
        this.maxStamina = SubStats.Stamina;
        this.stamina = this.maxStamina;
        this.xp = 0;
        if (level && level > 0)
            this.level = level;
        else
            this.level = 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);
        this.classSelect = false;
        this.classChosen = false;
        this.playerClass = null;
    }
    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup", e => this.keys.delete(e.key.toLowerCase()));
    }
    update() {
        if (this.classSelect)
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
        if (!checkCollision(newX, this.y) && !checkCollision(newX + this.playerSize, this.y) &&
            !checkCollision(newX, this.y + this.playerSize) &&
            !checkCollision(newX + this.playerSize, this.y + this.playerSize)) {
            this.x = newX;
        }
        const newY = this.y + dy;
        if (!checkCollision(this.x, newY) && !checkCollision(this.x + this.playerSize, newY) &&
            !checkCollision(this.x, newY + this.playerSize) &&
            !checkCollision(this.x + this.playerSize, newY + this.playerSize)) {
            this.y = newY;
        }
    }
    increaseXP(amount) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = 100 * Math.pow(2, this.level);
            if (this.level >= 5 && !this.classChosen) {
                this.classSelect = true;
            }
        }
    }
    selectClass(choice) {
        this.playerClass = new playerClasses(choice, this, this.level);
        this.classChosen = true;
        this.classSelect = false;
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
    }
}
//# sourceMappingURL=player.js.map