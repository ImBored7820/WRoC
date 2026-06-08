/**
 * Author: musa -
 * Date: 06/03/2026
 *
 * Description: Boss entity with pixel-art texture and special attacks
 * Info: WRoC | Boss.ts | WebStorm
 */
import type { Player } from "./player.js";
import { checkRectCollision } from "./collisionlogic.js";
import { drawPlayer } from "../assets/drawPlayer.js";

const BASE_BOSS_HEALTH = 500;
const BASE_BOSS_ATTACK = 5;

const bossPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 1, 0,
    0, 3, 0, 0, 3, 0,
    0, 3, 0, 0, 3, 0,
];

export class boss {
    x: number;
    y: number;
    type: string;
    name: string;
    isDead: boolean;

    health: number;
    maxHealth: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;

    bossSize: number;
    homeRoomId: number;
    damageFlashTimer: number;

    specialAbility: string;
    specialAttackCooldown: number;
    lastSpecialAttack: number;

    shockwaveTimer: number;
    shockwaveRadius: number;

    isStunned: boolean;
    stunTimer: number;

    constructor(x: number, y: number, type: string, name: string, homeRoomId = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = name;
        this.isDead = false;
        this.bossSize = 48;
        this.homeRoomId = homeRoomId;
        this.damageFlashTimer = 0;

        this.maxHealth = BASE_BOSS_HEALTH;
        this.health = this.maxHealth;
        this.attackPower = BASE_BOSS_ATTACK;
        this.lastAttackTime = 0;
        this.attackCooldown = 1500;
        this.specialAbility = "Shockwave";
        this.specialAttackCooldown = 5000;
        this.lastSpecialAttack = 0;

        this.shockwaveTimer = 0;
        this.shockwaveRadius = 0;

        this.isStunned = false;
        this.stunTimer = 0;
    }

    loseHP(player: Player) {
        let playerAP = player.body * 3;
        if (player.equippedWeapon?.name === "Sharp Pencil") {
            playerAP *= 1.2;
        }
        this.health -= playerAP;
        this.damageFlashTimer = 8;
        if (this.health <= 0) {
            this.isDead = true;
            this.health = 0;
        }
    }

    specialAttack(player: Player) {
        player.health = Math.floor(player.health * 0.5);
        this.shockwaveTimer = 20;
        this.shockwaveRadius = 0;
    }

    bossMovement(player: Player) {
        if (this.isDead || this.isStunned) {
            if (this.isStunned) {
                this.stunTimer--;
                if (this.stunTimer <= 0) this.isStunned = false;
            }
            return;
        }

        const now = performance.now();
        const playerRelativeX = player.x - this.x;
        const playerRelativeY = player.y - this.y;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        // Fire special attack on cooldown when player is in range
        if (now - this.lastSpecialAttack >= this.specialAttackCooldown && distance <= 300) {
            this.specialAttack(player);
            this.lastSpecialAttack = now;
        }

        const moveBossX = (dx: number) => {
            const newX = this.x + dx;
            if (!checkRectCollision(newX, this.y, this.bossSize, this.bossSize)) {
                this.x = newX;
            }
        };

        const moveBossY = (dy: number) => {
            const newY = this.y + dy;
            if (!checkRectCollision(this.x, newY, this.bossSize, this.bossSize)) {
                this.y = newY;
            }
        };

        if (distance <= 360) {
            if (playerRelativeX > 0) moveBossX(4);
            if (playerRelativeX < 0) moveBossX(-4);
            if (playerRelativeY > 0) moveBossY(4);
            if (playerRelativeY < 0) moveBossY(-4);
        }
    }

    tryNormalAttack(player: Player): boolean {
        const now = performance.now();
        const touching =
            player.x < this.x + this.bossSize &&
            player.x + player.playerSize > this.x &&
            player.y < this.y + this.bossSize &&
            player.y + player.playerSize > this.y;

        if (touching && now - this.lastAttackTime >= this.attackCooldown) {
            player.loseHPFromBoss(this.attackPower);
            this.lastAttackTime = now;
            return true;
        }
        return false;
    }

    getColorMap(): { [key: number]: string } {
        return {
            0: "#c8a070", 1: "#1a2a4a", 2: "#eeeeee", 3: "#2a2a3a",
        };
    }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.isDead) return;

        drawPlayer(ctx, this.x, this.y, this.bossSize, this.bossSize, bossPattern, this.getColorMap());

        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
            this.damageFlashTimer--;
        }

        // Shockwave visual for principal special attack
        if (this.shockwaveTimer > 0) {
            const progress = 1 - this.shockwaveTimer / 20;
            const radius = progress * this.bossSize * 2;
            const alpha = 0.6 * (1 - progress);
            ctx.beginPath();
            ctx.arc(this.x + this.bossSize / 2, this.y + this.bossSize / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 200, 50, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            this.shockwaveTimer--;
        }

        // Health bar above sprite
        const barY = this.y - 16;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(this.x, barY, this.bossSize, 8);
        ctx.fillStyle = "rgba(220, 50, 50, 0.9)";
        ctx.fillRect(this.x, barY, (this.health / this.maxHealth) * this.bossSize, 8);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, barY, this.bossSize, 8);

        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x + this.bossSize / 2, barY - 4);
    }
}
