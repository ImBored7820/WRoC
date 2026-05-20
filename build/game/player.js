import { checkRectCollision } from "./collisionlogic.js";
import { playerClasses } from "./playerClasses.js";
import { Mob } from "./mob.js";
import { drawPlayer } from "../assets/drawPlayer.js";
const playerPattern = [
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1,
];
export const playerColors = {
    0: "#080810",
    1: "#101018",
};
export class Player {
    x;
    y;
    playerSize;
    speed;
    health;
    stamina;
    name;
    level;
    xp;
    xpToNextLevel;
    maxHealth;
    maxStamina;
    mind;
    body;
    soul;
    extraStatPoints;
    classSelect;
    classChosen;
    playerClass;
    isPlayerDead;
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
        this.playerSize = 34;
        this.name = "Player";
        this.maxHealth = 100;
        this.maxStamina = 100;
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.speed = 6;
        this.xp = 0;
        if (level && level > 0)
            this.level = level;
        else
            this.level = 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);
        this.classSelect = false;
        this.classChosen = false;
        this.playerClass = null;
        this.isPlayerDead = false;
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
            dy -= this.speed + speedBoost;
        if (this.keys.has("s") || this.keys.has("arrowdown"))
            dy += this.speed + speedBoost;
        if (this.keys.has("a") || this.keys.has("arrowleft"))
            dx -= this.speed + speedBoost;
        if (this.keys.has("d") || this.keys.has("arrowright"))
            dx += this.speed + speedBoost;
        const newX = this.x + dx;
        if (!checkRectCollision(newX, this.y, this.playerSize, this.playerSize)) {
            this.x = newX;
        }
        const newY = this.y + dy;
        if (!checkRectCollision(this.x, newY, this.playerSize, this.playerSize)) {
            this.y = newY;
        }
    }
    loseHP(mob) {
        this.health -= mob.attackPower;
        if (this.health <= 0) {
            this.isPlayerDead = true;
            this.health = 0;
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
        drawPlayer(ctx, this.x, this.y, this.playerSize, this.playerSize, playerPattern, playerColors);
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.fillText("Name: " + this.name.toString() + " Health: " + this.health, this.x + this.playerSize / 2, this.y - 8);
    }
}
//# sourceMappingURL=player.js.map