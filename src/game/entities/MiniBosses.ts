/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Three distinct miniboss entities with unique abilities
 * Info: WRoC | MiniBosses.ts | WebStorm
 */
import { boss } from "../Boss.js";
import type { Player } from "../player.js";
import { drawPlayer } from "../../assets/drawPlayer.js";
import type { Item } from "../items/Item.js";
import { SharpPencil, LongRuler, TrackShoes } from "../items/Item.js";

const humanoidPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0,
];

export interface PaintZone {
    x: number;
    y: number;
    radius: number;
    timer: number;
    color: string;
}

export class MiniBoss extends boss {
    xpReward: number;
    dropItem: () => Item;
    defeatedBannerTimer: number;
    dropProcessed: boolean;
    paintZones: PaintZone[] = [];

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
        this.bossSize = 42;
    }

    getPattern(): number[] {
        return humanoidPattern;
    }

    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#888888", 2: "#ffffff", 3: "#333333" };
    }

    draw(ctx: CanvasRenderingContext2D) {
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

        drawPlayer(ctx, this.x, this.y, this.bossSize, this.bossSize, this.getPattern(), this.getColorMap());

        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
            this.damageFlashTimer--;
        }

        // Draw paint zones for Ms. Inksworth
        for (const zone of this.paintZones) {
            ctx.beginPath();
            ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
            ctx.fillStyle = zone.color;
            ctx.fill();
            zone.timer--;
        }
        this.paintZones = this.paintZones.filter(z => z.timer > 0);

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

    onDeath() {
        this.defeatedBannerTimer = 120; // 2 seconds at 60fps
    }
}

// MiniBoss 1 — Ms. Inksworth (Art Teacher)
export class MsInksworth extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "Ms. Inksworth", homeRoomId,
            750, 2, "Paint Splash", 6000, 500, () => new SharpPencil());
    }

    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#e06040", 2: "#40a0c0", 3: "#8040a0" };
    }

    specialAttack(_player: Player) {
        // Creates a 3x3 tile slow zone for 3 seconds
        const colors = ["rgba(255,100,100,0.3)", "rgba(100,200,255,0.3)", "rgba(255,200,50,0.3)"];
        this.paintZones.push({
            x: this.x + this.bossSize / 2,
            y: this.y + this.bossSize / 2,
            radius: 54,
            timer: 180,
            color: colors[Math.floor(Math.random() * colors.length)],
        });
    }
}

// MiniBoss 2 — Coach Brutus (PE Teacher)
export class CoachBrutus extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "Coach Brutus", homeRoomId,
            1000, 6, "Whistle Blast", 8000, 500, () => new LongRuler());
    }

    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#5a6a8a", 2: "#ffd700", 3: "#3a4a6a" };
    }

    specialAttack(player: Player) {
        // Pushes player back 5 tiles instantly
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        player.knockbackVx = (dx / dist) * 180;
        player.knockbackVy = (dy / dist) * 180;
        player.knockbackTimer = 30;
    }
}

// MiniBoss 3 — Vice Principal Stern
export class VicePrincipalStern extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number) {
        super(x, y, "VP Stern", homeRoomId,
            600, 4, "Detention!", 10000, 500, () => new TrackShoes());
    }

    getColorMap(): { [key: number]: string } {
        return { 0: "#c8a888", 1: "#1a1a2a", 2: "#cccccc", 3: "#0a0a1a" };
    }

    specialAttack(player: Player) {
        player.isFrozen = true;
        player.freezeTimer = 90; // 1.5 seconds at 60fps
    }
}
