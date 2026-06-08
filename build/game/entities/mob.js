import { checkRectCollision } from "../collisionlogic.js";
import { drawPlayer } from "../../assets/drawPlayer.js";
const BASE_MOB_HEALTH = 60;
const BASE_MOB_ATTACK = 8;
const zombiePattern = [
    2, 2, 2, 2, 2, 2,
    2, 0, 0, 0, 0, 2,
    2, 0, 0, 0, 1, 2,
    2, 1, 1, 1, 1, 2,
    2, 0, 1, 1, 0, 2,
    2, 2, 0, 0, 2, 2,
];
const skeletonPattern = [
    2, 0, 0, 0, 0, 2,
    0, 0, 2, 2, 0, 0,
    2, 1, 2, 2, 1, 2,
    2, 1, 2, 2, 1, 2,
    2, 0, 1, 1, 0, 2,
    2, 0, 2, 2, 0, 2,
];
const humanoidPattern = [
    0, 0, 0, 0, 0, 0,
    0, 2, 0, 0, 2, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 0, 1, 1, 0, 0,
];
function drawMobSprite(ctx, x, y, size, pattern, colors, damageFlashTimer) {
    drawPlayer(ctx, x, y, size, size, pattern, colors);
    if (damageFlashTimer > 0) {
        ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
        ctx.fillRect(x, y, size, size);
    }
}
export class Mob {
    mobX;
    mobY;
    level;
    mobSize;
    name;
    mobType;
    attackPower;
    lastAttackTime;
    attackCooldown;
    mobHealth;
    maxMobHealth;
    moveSpeed;
    isMobDead;
    homeRoomId;
    damageFlashTimer;
    isStunned;
    stunTimer;
    wanderDirX = 0;
    wanderDirY = 0;
    wanderTimer = 0;
    pattern;
    colorMap;
    constructor(mobX, mobY, level, homeRoomId, mobType, pattern, colorMap, moveSpeed = 4, attackPower = BASE_MOB_ATTACK, health = BASE_MOB_HEALTH) {
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 30;
        this.isMobDead = false;
        this.name = mobType;
        this.mobType = mobType;
        this.homeRoomId = homeRoomId;
        this.damageFlashTimer = 0;
        this.isStunned = false;
        this.stunTimer = 0;
        this.attackPower = attackPower;
        this.lastAttackTime = 0;
        this.attackCooldown = 800;
        this.maxMobHealth = health;
        this.mobHealth = health;
        this.moveSpeed = moveSpeed;
        this.pattern = pattern;
        this.colorMap = colorMap;
    }
    loseHP(player) {
        let playerAP = player.body * 3;
        if (player.equippedWeapon?.name === "Sharp Pencil") {
            playerAP *= 1.2;
        }
        this.mobHealth -= playerAP;
        this.damageFlashTimer = 8;
        if (this.mobHealth <= 0) {
            this.isMobDead = true;
            this.mobHealth = 0;
        }
    }
    mobMovement(player) {
        if (this.isStunned) {
            this.stunTimer--;
            if (this.stunTimer <= 0)
                this.isStunned = false;
            return;
        }
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
                moveX(this.moveSpeed);
            if (playerRelativeX < 0)
                moveX(-this.moveSpeed);
            if (playerRelativeY > 0)
                moveY(this.moveSpeed);
            if (playerRelativeY < 0)
                moveY(-this.moveSpeed);
        }
        if (!isPlayerClose) {
            if (this.wanderTimer <= 0) {
                this.wanderDirX = (Math.floor(Math.random() * 3) - 1);
                this.wanderDirY = (Math.floor(Math.random() * 3) - 1);
                this.wanderTimer = 30;
            }
            this.wanderTimer--;
            if (this.wanderDirX !== 0)
                moveX(this.wanderDirX * 1.5);
            if (this.wanderDirY !== 0)
                moveY(this.wanderDirY * 1.5);
        }
    }
    draw(ctx) {
        drawMobSprite(ctx, this.mobX, this.mobY, this.mobSize, this.pattern, this.colorMap, this.damageFlashTimer);
        if (this.mobHealth < this.maxMobHealth || this.damageFlashTimer > 0) {
            const barW = this.mobSize;
            const barH = 4;
            const barX = this.mobX;
            const barY = this.mobY - 8;
            const hpPercent = this.mobHealth / this.maxMobHealth;
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(barX, barY, barW, barH);
            const r = Math.round(255 * (1 - hpPercent));
            const g = Math.round(200 * hpPercent);
            ctx.fillStyle = `rgb(${r}, ${g}, 30)`;
            ctx.fillRect(barX, barY, barW * hpPercent, barH);
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barW, barH);
        }
        if (this.damageFlashTimer > 0)
            this.damageFlashTimer--;
    }
}
export class ZombieMob extends Mob {
    constructor(x, y, level, homeRoomId, playerLevel) {
        const health = BASE_MOB_HEALTH * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Zombie", zombiePattern, {
            0: "#7fff00", 1: "#2d5a00", 2: "#1a1a00",
        }, 1.5, attack, health);
    }
}
export class SkeletonMob extends Mob {
    constructor(x, y, level, homeRoomId, playerLevel) {
        const health = BASE_MOB_HEALTH * 0.5 * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 1.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Skeleton", skeletonPattern, {
            0: "#f0ede0", 1: "#1a1a2a", 2: "#8a8a78",
        }, 4, attack, health);
    }
}
export class HallMonitorMob extends Mob {
    constructor(x, y, level, homeRoomId, playerLevel) {
        const health = BASE_MOB_HEALTH * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 1.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Hall Monitor", humanoidPattern, {
            0: "#e8c898", 1: "#1a3a6a", 2: "#f0c040",
        }, 4, attack, health);
    }
}
export class TeacherMob extends Mob {
    constructor(x, y, level, homeRoomId, playerLevel) {
        const health = BASE_MOB_HEALTH * 1.5 * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 2.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Teacher", humanoidPattern, {
            0: "#c8a070", 1: "#5a1a2a", 2: "#f0e8d8",
        }, 2, attack, health);
    }
}
export { BASE_MOB_HEALTH, BASE_MOB_ATTACK };
//# sourceMappingURL=mob.js.map