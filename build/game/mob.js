import { checkCollision } from "./map.js";
export class Mob {
    mobX;
    mobY;
    level;
    mobSize;
    attackPower;
    mobHealth;
    isMobDead;
    constructor(mobX, mobY, level) {
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 25;
        this.isMobDead = false;
        this.attackPower = 1;
        this.mobHealth = 10;
    }
    loseHP(player) {
        let playerAP = player.body * 5;
        if (this.mobHealth > 0) {
            this.mobHealth -= playerAP;
        }
        else {
            this.isMobDead = true;
        }
    }
    mobMovement(player) {
        let isPlayerClose = false;
        const playerRelativeX = player.x - this.mobX;
        const playerRelativeY = player.y - this.mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);
        const moveX = (dx) => {
            const newX = this.mobX + dx;
            if (!checkCollision(newX, this.mobY) &&
                !checkCollision(newX + this.mobSize, this.mobY) &&
                !checkCollision(newX, this.mobY + this.mobSize) &&
                !checkCollision(newX + this.mobSize, this.mobY + this.mobSize)) {
                this.mobX = newX;
            }
        };
        const moveY = (dy) => {
            const newY = this.mobY + dy;
            if (!checkCollision(this.mobX, newY) &&
                !checkCollision(this.mobX + this.mobSize, newY) &&
                !checkCollision(this.mobX, newY + this.mobSize) &&
                !checkCollision(this.mobX + this.mobSize, newY + this.mobSize)) {
                this.mobY = newY;
            }
        };
        if (distance <= 108) {
            isPlayerClose = true;
            if (playerRelativeX > 0)
                moveX(9);
            if (playerRelativeX < 0)
                moveX(-9);
            if (playerRelativeY > 0)
                moveY(9);
            if (playerRelativeY < 0)
                moveY(-9);
        }
        if (!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 9;
            const randomY = (Math.floor(Math.random() * 3) - 1) * 9;
            if (randomX !== 0)
                moveX(randomX);
            if (randomY !== 0)
                moveY(randomY);
        }
    }
    draw(ctx) {
        ctx.fillRect(this.mobX, this.mobY, this.mobSize, this.mobSize);
    }
}
//# sourceMappingURL=mob.js.map