import { checkRectCollision } from "./collisionlogic.js";
export class Mob {
    mobX;
    mobY;
    level;
    mobSize;
    name;
    attackPower;
    lastAttackTime;
    attackCooldown;
    mobHealth;
    isMobDead;
    constructor(mobX, mobY, level, name) {
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 25;
        this.isMobDead = false;
        this.attackPower = 1;
        this.lastAttackTime = 0;
        this.attackCooldown = 1000;
        this.mobHealth = 100;
        this.name = name;
    }
    loseHP(player) {
        let playerAP = player.body * 3;
        this.mobHealth -= playerAP;
        if (this.mobHealth <= 0) {
            this.isMobDead = true;
            this.mobHealth = 0;
        }
    }
    mobMovement(player) {
        let isPlayerClose = false;
        const playerRelativeX = player.x - this.mobX;
        const playerRelativeY = player.y - this.mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);
        const moveX = (dx) => {
            const newX = this.mobX + dx;
            if (!checkRectCollision(newX, this.mobY, this.mobSize, this.mobSize)) {
                this.mobX = newX;
            }
        };
        const moveY = (dy) => {
            const newY = this.mobY + dy;
            if (!checkRectCollision(this.mobX, newY, this.mobSize, this.mobSize)) {
                this.mobY = newY;
            }
        };
        if (distance <= 108) {
            isPlayerClose = true;
            if (playerRelativeX > 0)
                moveX(4);
            if (playerRelativeX < 0)
                moveX(-4);
            if (playerRelativeY > 0)
                moveY(4);
            if (playerRelativeY < 0)
                moveY(-4);
        }
        if (!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 2;
            const randomY = (Math.floor(Math.random() * 3) - 1) * 2;
            if (randomX !== 0)
                moveX(randomX);
            if (randomY !== 0)
                moveY(randomY);
        }
    }
    draw(ctx) {
        ctx.fillRect(this.mobX, this.mobY, this.mobSize, this.mobSize);
        ctx.font = "24px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("Iter: " + this.name.toString() + " Health: " + this.mobHealth, this.mobX + this.mobSize / 2, this.mobY - 8);
    }
}
//# sourceMappingURL=mob.js.map