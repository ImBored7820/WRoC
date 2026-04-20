import { checkCollision } from "./map.js";
export class Mob {
    mobX;
    mobY;
    level;
    mobSize;
    attackPower;
    mobHealth;
    constructor(mobX, mobY, level) {
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 25;
        this.attackPower = level * 5;
        this.mobHealth = level * 10;
    }
    attack(player) {
        player.health -= this.attackPower;
    }
    loseHp(player) {
        let playerAP = player.body * 5;
        this.mobHealth -= playerAP;
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
                moveX(36);
            if (playerRelativeX < 0)
                moveX(-36);
            if (playerRelativeY > 0)
                moveY(36);
            if (playerRelativeY < 0)
                moveY(-36);
        }
        if (!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 36;
            const randomY = (Math.floor(Math.random() * 3) - 1) * 36;
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