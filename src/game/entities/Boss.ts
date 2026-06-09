/**
 * Author: musa -
 * Date: 06/03/2026
 *
 * Description: Boss entity with pixel-art texture and special attacks
 * Info: WRoC | Boss.ts | WebStorm
 */
import type { Player } from "../player.js";
import { checkRectCollision } from "../collisionlogic.js";
import { drawPlayer } from "../../assets/drawPlayer.js";

// starting stats for all bosses
const BASE_BOSS_HEALTH = 1500;
const BASE_BOSS_ATTACK = 5;

// pixel pattern for boss sprite - makes them look menacing
const bossPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 1, 0,  // those 2s are the glowing eyes
    0, 3, 0, 0, 3, 0,  // dark mouth area
    0, 3, 0, 0, 3, 0,
];

export class boss {
    // position stuff
    x: number;
    y: number;
    type: string;
    name: string;
    isDead: boolean;

    // combat stats
    health: number;
    maxHealth: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;

    // visual and room data
    bossSize: number;
    homeRoomId: number;
    damageFlashTimer: number;  // makes boss flash red when hurt

    // special attack stuff
    specialAbility: string;
    specialAttackCooldown: number;
    lastSpecialAttack: number;

    // shockwave effect variables
    shockwaveTimer: number;
    shockwaveRadius: number;

    // stun mechanics
    isStunned: boolean;
    stunTimer: number;

    constructor(x: number, y: number, type: string, name: string, homeRoomId = 0) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = name;
        this.isDead = false;
        this.bossSize = 48;  // bigger than regular enemies
        this.homeRoomId = homeRoomId;
        this.damageFlashTimer = 0;

        // health and damage setup
        this.maxHealth = BASE_BOSS_HEALTH;
        this.health = this.maxHealth;
        this.attackPower = BASE_BOSS_ATTACK;
        this.lastAttackTime = 0;
        this.attackCooldown = 1500;  // 1.5 seconds between attacks

        // special ability setup - all bosses get shockwave by default
        this.specialAbility = "Shockwave";
        this.specialAttackCooldown = 5000;  // 5 seconds between special attacks
        this.lastSpecialAttack = 0;

        // shockwave visual effect starts at zero
        this.shockwaveTimer = 0;
        this.shockwaveRadius = 0;

        // boss starts not stunned
        this.isStunned = false;
        this.stunTimer = 0;
    }

    // when player hits the boss
    loseHP(player: Player) {
        // calculate damage based on player's body stat
        let playerAP = player.body * 3;

        // sharp pencil gives damage bonus
        if (player.equippedWeapon?.name === "Sharp Pencil") {
            playerAP *= 1.2;  // 20% damage boost
        }

        this.health -= playerAP;
        this.damageFlashTimer = 8;  // flash red for 8 frames

        // check if boss is defeated
        if (this.health <= 0) {
            this.isDead = true;
            this.health = 0;  // don't go negative
        }
    }

    // boss special attack - cuts player health in half
    specialAttack(player: Player) {
        player.health = Math.floor(player.health * 0.5);  // ouch that hurts
        this.shockwaveTimer = 20;  // start the visual effect
        this.shockwaveRadius = 0;
    }

    // how the boss moves and decides what to do
    bossMovement(player: Player) {
        // can't move if dead or stunned
        if (this.isDead || this.isStunned) {
            if (this.isStunned) {
                this.stunTimer--;
                if (this.stunTimer <= 0) this.isStunned = false;  // wake up
            }
            return;
        }

        const now = performance.now();

        // figure out where player is relative to boss
        const playerRelativeX = player.x - this.x;
        const playerRelativeY = player.y - this.y;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        // use special attack if player is close enough and cooldown is ready
        if (now - this.lastSpecialAttack >= this.specialAttackCooldown && distance <= 300) {
            this.specialAttack(player);
            this.lastSpecialAttack = now;
        }

        // helper functions to move boss without going through walls
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

        // chase the player if they're close enough
        if (distance <= 360) {
            if (playerRelativeX > 0) moveBossX(4);   // player is to the right
            if (playerRelativeX < 0) moveBossX(-4);  // player is to the left
            if (playerRelativeY > 0) moveBossY(4);   // player is below
            if (playerRelativeY < 0) moveBossY(-4);  // player is above
        }
    }

    // try to attack player if touching and cooldown is ready
    tryNormalAttack(player: Player): boolean {
        const now = performance.now();

        // check if boss and player sprites are overlapping
        const touching =
            player.x < this.x + this.bossSize &&
            player.x + player.playerSize > this.x &&
            player.y < this.y + this.bossSize &&
            player.y + player.playerSize > this.y;

        // attack if touching and enough time has passed
        if (touching && now - this.lastAttackTime >= this.attackCooldown) {
            player.loseHPFromBoss(this.attackPower);
            this.lastAttackTime = now;
            return true;  // attack happened
        }
        return false;  // no attack
    }

    // colors for the boss sprite
    getColorMap(): { [key: number]: string } {
        return {
            0: "#c8a070",  // tan skin
            1: "#1a2a4a",  // dark blue outfit
            2: "#eeeeee",  // white glowing eyes
            3: "#2a2a3a",  // dark mouth/shadow areas
        };
    }

    // draw the boss on screen
    draw(ctx: CanvasRenderingContext2D) {
        if (this.isDead) return;  // don't draw dead bosses

        // draw the main boss sprite
        drawPlayer(ctx, this.x, this.y, this.bossSize, this.bossSize, bossPattern, this.getColorMap());

        // red damage flash effect
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
            this.damageFlashTimer--;
        }

        // shockwave visual for special attack
        if (this.shockwaveTimer > 0) {
            const progress = 1 - this.shockwaveTimer / 20;  // how far along the animation is
            const radius = progress * this.bossSize * 2;    // grows outward
            const alpha = 0.6 * (1 - progress);             // fades out as it grows

            ctx.beginPath();
            ctx.arc(this.x + this.bossSize / 2, this.y + this.bossSize / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 200, 50, ${alpha})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            this.shockwaveTimer--;
        }

        // health bar above the boss
        const barY = this.y - 16;

        // black background for health bar
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(this.x, barY, this.bossSize, 8);

        // red health bar that shrinks as boss takes damage
        ctx.fillStyle = "rgba(220, 50, 50, 0.9)";
        ctx.fillRect(this.x, barY, (this.health / this.maxHealth) * this.bossSize, 8);

        // white border around health bar
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, barY, this.bossSize, 8);

        // boss name text above health bar
        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x + this.bossSize / 2, barY - 4);
    }
}