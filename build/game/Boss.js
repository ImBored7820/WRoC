import { checkRectCollision } from "./collisionlogic.js";
const mobPattern = [];
export class boss {
    x;
    y;
    type;
    name;
    isDead;
    health;
    attackPower;
    lastAttackTime;
    attackCooldown;
    bossSize;
    constructor(x, y, type, name) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = name;
        this.isDead = false;
        this.bossSize = 144;
        this.health = 5;
    }
    loseHP(player) {
        let playerAP = player.body * 3;
        this.health -= playerAP;
        if (this.health <= 0) {
            this.isDead = true;
            this.health = 0;
        }
    }
    specialAttack(player) {
        player.health = player.health * 0.5;
    }
    bossMovement(player) {
        let isPlayerClose = false;
        const playerRelativeX = player.x - this.x;
        const playerRelativeY = player.y - this.y;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);
        const moveBossX = (dx) => {
            const newX = this.x + dx;
            if (!checkRectCollision(newX, this.y, this.bossSize, this.bossSize)) {
                this.x = newX;
            }
        };
        const moveBossY = (dy) => {
            const newY = this.y + dy;
            if (!checkRectCollision(this.x, newY, this.bossSize, this.bossSize)) {
                this.y = newY;
            }
        };
        if (distance <= 720) {
            isPlayerClose = true;
            if (playerRelativeX > 0)
                moveBossX(8);
            if (playerRelativeX < 0)
                moveBossX(-8);
            if (playerRelativeY > 0)
                moveBossY(8);
            if (playerRelativeY < 0)
                moveBossY(-8);
        }
        if (!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 2;
            const randomY = (Math.floor(Math.random() * 3) - 1) * 2;
            if (randomX !== 0)
                moveBossX(randomX);
            if (randomY !== 0)
                moveBossY(randomY);
        }
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
        ctx.font = "24px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Iter: " + this.name.toString() + " Health: " + this.health, this.x + this.bossSize / 2, this.y - 8);
    }
}
//# sourceMappingURL=Boss.js.map