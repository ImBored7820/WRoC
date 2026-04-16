export class Mob {
    mobX;
    mobY;
    level;
    attackPower;
    mobHealth;
    constructor(mobX, mobY, level) {
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
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
        if (distance <= 108) {
            isPlayerClose = true;
            if (playerRelativeX > 0)
                this.mobX += 36;
            if (playerRelativeX < 0)
                this.mobX -= 36;
            if (playerRelativeY > 0)
                this.mobY += 36;
            if (playerRelativeY < 0)
                this.mobY -= 36;
        }
        if (!isPlayerClose) {
            const randomX = Math.random() * 36;
            const randomY = Math.random() * 36;
            this.mobX += randomX;
            this.mobY += randomY;
        }
    }
    draw(ctx) {
        ctx.fillRect(this.mobX, this.mobY, 20, 20);
    }
}
//# sourceMappingURL=mob.js.map