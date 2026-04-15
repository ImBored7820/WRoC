class Mob {
    x;
    y;
    level;
    attackPower;
    mobHealth;
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
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
    mobMovement() {
    }
    draw(ctx) {
        ctx.fillRect(this.x, this.y, 30, 30);
    }
}
export {};
//# sourceMappingURL=mob.js.map