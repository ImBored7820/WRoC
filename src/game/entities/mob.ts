/**
 * Author: 2030971 -
 * Date: 04/14/2026
 *
 * Description: Mob entities with pixel-art textures and room awareness
 * Info: WRoC | mob.ts | WebStorm
 */
import type { Player } from "../player.js";
import { checkRectCollision } from "../collisionlogic.js";
import { drawPlayer } from "../../assets/drawPlayer.js";

const BASE_MOB_HEALTH = 60; // base stats for all mobs before scaling
const BASE_MOB_ATTACK = 8; // base stats for all mobs before scaling

// zombiePattern — blocky head with outstretched arm suggestion
const zombiePattern = [
    2, 2, 2, 2, 2, 2,  // dark outline top
    2, 0, 0, 0, 0, 2,  // head row
    2, 0, 0, 0, 1, 2,  // face with right arm raised
    2, 1, 1, 1, 1, 2,  // torso
    2, 0, 1, 1, 0, 2,  // lower torso / hips
    2, 2, 0, 0, 2, 2,  // legs
];

// skeletonPattern — hollow center, ribcage suggestion
const skeletonPattern = [
    2, 0, 0, 0, 0, 2,  // skull (rounder, no outline top)
    0, 0, 2, 2, 0, 0,  // eye sockets (dark gaps)
    2, 1, 2, 2, 1, 2,  // rib cage (alternating)
    2, 1, 2, 2, 1, 2,  // rib cage lower
    2, 0, 1, 1, 0, 2,  // pelvis
    2, 0, 2, 2, 0, 2,  // leg bones
];

// humanoidPattern (hall monitor / teacher) — distinct head vs body
const humanoidPattern = [
    0, 0, 0, 0, 0, 0,  // transparent top
    0, 2, 0, 0, 2, 0,  // head with collar suggestion
    0, 1, 1, 1, 1, 0,  // shoulders / torso top
    0, 1, 2, 2, 1, 0,  // chest (badge/shirt detail)
    0, 1, 1, 1, 1, 0,  // torso lower
    0, 0, 1, 1, 0, 0,  // legs
];

function drawMobSprite(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, size: number,
    pattern: number[],
    colors: { [key: number]: string },
    damageFlashTimer: number
) {
    drawPlayer(ctx, x, y, size, size, pattern, colors);
    if (damageFlashTimer > 0) {
        ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
        ctx.fillRect(x, y, size, size);
    }
}

export class Mob {
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number; // smaller than minibosses
    name: string;
    mobType: string;

    attackPower: number;
    lastAttackTime: number; // last time the mob attacked
    attackCooldown: number; // ms between attacks
    mobHealth: number;
    maxMobHealth: number;
    moveSpeed: number;

    isMobDead: boolean;
    homeRoomId: number; // which room this mob belongs to
    damageFlashTimer: number; // red flash when hurt
    isStunned: boolean;
    stunTimer: number;

    wanderDirX: number = 0;
    wanderDirY: number = 0;
    wanderTimer: number = 0;

    protected pattern: number[];
    protected colorMap: { [key: number]: string };

    public constructor(
        mobX: number, mobY: number, level: number,
        homeRoomId: number, mobType: string,
        pattern: number[], colorMap: { [key: number]: string },
        moveSpeed = 4, attackPower = BASE_MOB_ATTACK, health = BASE_MOB_HEALTH
    ) {
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
        this.attackCooldown = 800; // 0.8 seconds
        this.maxMobHealth = health;
        this.mobHealth = health;
        this.moveSpeed = moveSpeed;

        this.pattern = pattern;
        this.colorMap = colorMap;
    }

    loseHP(player: Player) { // damage calculation based on player body stat
        let playerAP = player.body * 3; // damage calculation based on player body stat
        if (player.equippedWeapon?.name === "Sharp Pencil") {
            playerAP *= 1.2; // sharp pencil bonus
        }
        this.mobHealth -= playerAP; // deduct health
        this.damageFlashTimer = 8;
        if (this.mobHealth <= 0) {
            this.isMobDead = true;
            this.mobHealth = 0; // dont go negative
        }
    }

    mobMovement(player: Player) {
        if (this.isStunned) {
            this.stunTimer--;
            if (this.stunTimer <= 0) this.isStunned = false;
            return;
        }

        let isPlayerClose = false;
        const playerRelativeX = player.x - this.mobX;
        const playerRelativeY = player.y - this.mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        const moveX = (dx: number) => { // helper functions to move with collision checking
            const newX = this.mobX + dx;
            if (!checkRectCollision(newX, this.mobY, this.mobSize, this.mobSize)) {
                this.mobX = newX;
            }
        };

        const moveY = (dy: number) => { // helper functions to move with collision checking
            const newY = this.mobY + dy;
            if (!checkRectCollision(this.mobX, newY, this.mobSize, this.mobSize)) {
                this.mobY = newY;
            }
        };

        if (distance <= 108) { // about 3-4 tiles
            isPlayerClose = true;
            if (playerRelativeX > 0) moveX(this.moveSpeed);
            if (playerRelativeX < 0) moveX(-this.moveSpeed);
            if (playerRelativeY > 0) moveY(this.moveSpeed);
            if (playerRelativeY < 0) moveY(-this.moveSpeed);
        }

        if (!isPlayerClose) {
            if (this.wanderTimer <= 0) { // pick new direction every half second
                this.wanderDirX = (Math.floor(Math.random() * 3) - 1);  // -1, 0, or 1
                this.wanderDirY = (Math.floor(Math.random() * 3) - 1);
                this.wanderTimer = 30;
            }
            this.wanderTimer--;
            if (this.wanderDirX !== 0) moveX(this.wanderDirX * 1.5);
            if (this.wanderDirY !== 0) moveY(this.wanderDirY * 1.5);
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        drawMobSprite(ctx, this.mobX, this.mobY, this.mobSize, this.pattern, this.colorMap, this.damageFlashTimer);
        
        // Health bar above mob — only show when not at full health or when damaged recently
        if (this.mobHealth < this.maxMobHealth || this.damageFlashTimer > 0) {
            const barW = this.mobSize;
            const barH = 4;
            const barX = this.mobX;
            const barY = this.mobY - 8;
            const hpPercent = this.mobHealth / this.maxMobHealth;

            // Background
            ctx.fillStyle = "rgba(0,0,0,0.7)";
            ctx.fillRect(barX, barY, barW, barH);

            // Fill — color shifts red→yellow→green based on HP
            const r = Math.round(255 * (1 - hpPercent));
            const g = Math.round(200 * hpPercent);
            ctx.fillStyle = `rgb(${r}, ${g}, 30)`;
            ctx.fillRect(barX, barY, barW * hpPercent, barH);

            // Border
            ctx.strokeStyle = "rgba(255,255,255,0.5)";
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barW, barH);
        }

        if (this.damageFlashTimer > 0) this.damageFlashTimer--;
    }
}
/* These specifc variations of the mobs follow everything a regular Mob does
 * With their own caveats
 */
export class ZombieMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number) {
        const health = BASE_MOB_HEALTH * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Zombie", zombiePattern, {
            0: "#7fff00", 1: "#2d5a00", 2: "#1a1a00",
        }, 1.5, attack, health);
    }
}

export class SkeletonMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number) {
        const health = BASE_MOB_HEALTH * 0.5 * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 1.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Skeleton", skeletonPattern, {
            0: "#f0ede0", 1: "#1a1a2a", 2: "#8a8a78",
        }, 4, attack, health);
    }
}

export class HallMonitorMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number) {
        const health = BASE_MOB_HEALTH * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 1.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Hall Monitor", humanoidPattern, {
            0: "#e8c898", 1: "#1a3a6a", 2: "#f0c040",
        }, 4, attack, health);
    }
}

export class TeacherMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number) {
        const health = BASE_MOB_HEALTH * 1.5 * (1 + playerLevel * 0.15);
        const attack = BASE_MOB_ATTACK * 2.5 * (1 + playerLevel * 0.1);
        super(x, y, level, homeRoomId, "Teacher", humanoidPattern, {
            0: "#c8a070", 1: "#5a1a2a", 2: "#f0e8d8",
        }, 2, attack, health);
    }
}

export { BASE_MOB_HEALTH, BASE_MOB_ATTACK };
