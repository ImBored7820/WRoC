/**
 * Author: musa -
 * Date: 06/01/2026
 *
 * Description: Three distinct miniboss entities with unique abilities
 * Info: WRoC | MiniBosses.ts | WebStorm
 */
import { boss } from "./Boss.js";
import type { Player } from "../player.js";
import { drawPlayer } from "../../assets/drawPlayer.js";
import type { Item } from "../items/Item.js";
import { SharpPencil, LongRuler, TrackShoes } from "../items/Item.js";

// What they look like, meant to look like humans 
const humanoidPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0,
];

// paint zones are for teahcer 1's special ability where she paints the ground
export interface PaintZone {
    x: number;
    y: number;
    radius: number;
    timer: number; // how long the zone lasts
    color: string;
}

export class MiniBoss extends boss {
    xpReward: number;
    dropItem: () => Item; // function that returns what item they drop when killed
    defeatedBannerTimer: number; // shows "DEFEATED" text for a bit
    dropProcessed: boolean;
    paintZones: PaintZone[] = []; // only used by teacher 1 but easier to put here

    constructor(
        x: number, y: number, name: string, homeRoomId: number,
        maxHealth: number, attackPower: number,
        specialAbility: string, specialCooldown: number,
        xpReward: number, dropItem: () => Item
    ) {
        super(x, y, "miniboss", name, homeRoomId);
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.attackPower = attackPower;
        this.specialAbility = specialAbility;
        this.specialAttackCooldown = specialCooldown;
        this.xpReward = xpReward;
        this.dropItem = dropItem;
        this.defeatedBannerTimer = 0;
        this.dropProcessed = false;
        this.bossSize = 42; // bigger than regular mobs
    }

    getPattern(): number[] {
        return humanoidPattern;
    }

    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#888888", 2: "#ffffff", 3: "#333333" };
    }

    draw(ctx: CanvasRenderingContext2D) {
        // if dead just show the defeated banner for a bit then stop drawing
        if (this.isDead) {
            if (this.defeatedBannerTimer > 0) {
                ctx.fillStyle = "rgba(255, 215, 0, 0.9)";
                ctx.font = "bold 20px monospace";
                ctx.textAlign = "center";
                ctx.fillText("DEFEATED", this.x + this.bossSize / 2, this.y - 30);
                this.defeatedBannerTimer--;
            }
            return;
        }

        // draw the actual boss sprite
        drawPlayer(ctx, this.x, this.y, this.bossSize, this.bossSize, this.getPattern(), this.getColorMap());

        // red flash when taking damage
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
            this.damageFlashTimer--;
        }

        // Draw paint zones for teacher 1
        for (const zone of this.paintZones) {
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.fillStyle = zone.color;
            ctx.fill();
            zone.timer--;
        }
        // clean up expired paint zones
        this.paintZones = this.paintZones.filter(z => z.timer > 0);

        // health bar above the boss
        const barY = this.y - 16;
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(this.x, barY, this.bossSize, 8);
        ctx.fillStyle = "rgba(220, 50, 50, 0.9)";
        ctx.fillRect(this.x, barY, (this.health / this.maxHealth) * this.bossSize, 8);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, barY, this.bossSize, 8);

        // boss name above health bar
        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.name, this.x + this.bossSize / 2, barY - 4);
    }

    onDeath() {
        this.defeatedBannerTimer = 120; // 2 seconds at 60fps
    }
}

// MiniBoss 1 - First entity who throws paint
export class Teacher1 extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "Entity One", homeRoomId,
            1000, 2, "Paint Splash", 6000, 500, () => new SharpPencil());
    }

    // Colors for Entity 1
    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#e06040", 2: "#40a0c0", 3: "#8040a0" };
    }

    specialAttack(_player: Player) {
        // Creates a 3x3 tile slow zone for 3 seconds
        const colors = ["rgba(255,100,100,0.3)", "rgba(100,200,255,0.3)", "rgba(255,200,50,0.3)"];
        this.paintZones.push({
            x: this.x + this.bossSize / 2,
            y: this.y + this.bossSize / 2,
            radius: 54, // covers about 3x3 tiles
            timer: 180, // 3 seconds at 60fps
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }
}

// MiniBoss 2 - Entity 2, pushes players around
export class Teacher2 extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "Entity Two ", homeRoomId,
            1200, 6, "Whistle Blast", 8000, 750, () => new LongRuler());
    }

    // Colors for Entity 2
    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#5a6a8a", 2: "#ffd700", 3: "#3a4a6a" };
    }

    specialAttack(player: Player) {
        // Pushes player back 5 tiles instantly
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1; // prevent divide by zero
        player.knockbackVx = (dx / dist) * 180; // knockback force
        player.knockbackVy = (dy / dist) * 180;
        player.knockbackTimer = 30; // half second of knockback
    }
}

// MiniBoss 3 - Greater Entity, freezes you in place, more health
export class Teacher3 extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "Greater Entity", homeRoomId,
            1500, 4, "Detention!", 10000, 1000, () => new TrackShoes());
    }

    // formal dark colors for the VP
    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#1a1a2a", 2: "#cccccc", 3: "#0a0a1a" };
    }

    specialAttack(player: Player) {
        // freezes player in detention basically
        player.isFrozen = true;
        player.freezeTimer = 90; // 1.5 seconds at 60fps
    }
}
