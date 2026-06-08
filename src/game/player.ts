/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: Player object with movement, combat, stamina, and abilities
 */
import { checkRectCollision } from "./collisionlogic.js";
import { playerClasses } from "./playerClasses.js";
import type { Mob } from "./entities/mob.js";
import { drawPlayer } from "../assets/drawPlayer.js";
import type { Item } from "./items/Item.js";

const playerPattern = [
    0, 0, 0, 0, 0, 0,  // head top (skin)
    0, 2, 0, 0, 2, 0,  // eyes (accent color)
    0, 1, 1, 1, 1, 0,  // torso
    0, 1, 2, 2, 1, 0,  // chest detail
    0, 1, 1, 1, 1, 0,  // torso lower
    0, 0, 1, 1, 0, 0,  // legs
];

export class Player {
    x: number;
    y: number;
    playerSize: number;

    speed: number;
    baseSpeed: number;
    health: number;
    stamina: number;

    name: string;
    level: number;

    xp: number;
    xpToNextLevel: number;

    maxHealth: number;
    maxStamina: number;

    mind: number;
    body: number;
    soul: number;
    extraStatPoints: number;

    classSelect: boolean;
    classChosen: boolean;
    playerClass: playerClasses | null;

    isPlayerDead: boolean;
    damageFlashTimer: number;

    playerColors: { [key: number]: string };

    equippedWeapon: Item | null;
    equippedArmour: Item | null;

    // Status effects from miniboss abilities
    isFrozen: boolean;
    freezeTimer: number;
    inPaintZone: boolean;
    knockbackVx: number;
    knockbackVy: number;
    knockbackTimer: number;

    // Ability animation state
    abilityAnimType: string;
    abilityAnimTimer: number;
    constructWallX: number;
    constructWallY: number;
    constructWallTimer: number;
    lastMoveDir: { x: number; y: number };

    staminaConsumedThisFrame: boolean;
    sprintBlocked: boolean;

    public keys: Set<string> = new Set();

    public constructor(x: number, y: number, level?: number, MBS?: number) {
        this.x = x;
        this.y = y;

        if (MBS && MBS < 100) MBS = 111;
        else if (!MBS) MBS = 111;

        const mbsToString = MBS.toString();
        const temp = mbsToString.split("").map(Number);
        this.mind = temp[0];
        this.body = temp[1];
        this.soul = temp[2];
        this.extraStatPoints = 0;

        this.playerSize = 30;
        this.name = "Player";

        this.maxHealth = 100;
        this.maxStamina = 100;
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.speed = 6;
        this.baseSpeed = 6;

        this.xp = 0;
        this.level = level && level > 0 ? level : 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);

        this.classSelect = false;
        this.classChosen = false;
        this.playerClass = null;
        this.isPlayerDead = false;
        this.damageFlashTimer = 0;

        this.playerColors = { 0: "#c8a888", 1: "#3366cc", 2: "#1a1a2a" };

        this.equippedWeapon = null;
        this.equippedArmour = null;

        this.isFrozen = false;
        this.freezeTimer = 0;
        this.inPaintZone = false;
        this.knockbackVx = 0;
        this.knockbackVy = 0;
        this.knockbackTimer = 0;

        this.abilityAnimType = "";
        this.abilityAnimTimer = 0;
        this.constructWallX = 0;
        this.constructWallY = 0;
        this.constructWallTimer = 0;
        this.lastMoveDir = { x: 0, y: 1 };

        this.staminaConsumedThisFrame = false;
        this.sprintBlocked = false;
    }

    setColors(skinColor: string, clothesColor: string) {
        // Derive a darker accent from clothes for details like eyes/chest
        this.playerColors = { 0: skinColor, 1: clothesColor, 2: "#1a1a2a" };
    }

    movementKeys() {
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup", e => this.keys.delete(e.key.toLowerCase()));
    }

    update() {
        if (this.classSelect || this.isFrozen) {
            if (this.isFrozen) {
                this.freezeTimer--;
                if (this.freezeTimer <= 0) this.isFrozen = false;
            }
            return;
        }

        this.staminaConsumedThisFrame = false;

        // Knockback from Coach Brutus
        if (this.knockbackTimer > 0) {
            const newX = this.x + this.knockbackVx / 30;
            const newY = this.y + this.knockbackVy / 30;
            if (!checkRectCollision(newX, this.y, this.playerSize, this.playerSize)) this.x = newX;
            if (!checkRectCollision(this.x, newY, this.playerSize, this.playerSize)) this.y = newY;
            this.knockbackTimer--;
            return;
        }

        let dx = 0;
        let dy = 0;
        const shiftHeld = this.keys.has("shift");
        const SPRINT_BONUS = 3;

        if (shiftHeld && !this.sprintBlocked) {
            this.stamina -= 0.5;
            this.staminaConsumedThisFrame = true;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.sprintBlocked = true;
            }
        }

        if (this.sprintBlocked && this.stamina > 20) {
            this.sprintBlocked = false;
        }

        // Walk speed is always baseSpeed; sprint adds a fixed bonus (not tied to body stat)
        let moveSpeed = this.baseSpeed;
        if (shiftHeld && !this.sprintBlocked) moveSpeed += SPRINT_BONUS;
        if (this.inPaintZone) moveSpeed *= 0.5;

        if (this.keys.has("w") || this.keys.has("arrowup")) { dy -= moveSpeed; this.lastMoveDir = { x: 0, y: -1 }; }
        if (this.keys.has("s") || this.keys.has("arrowdown")) { dy += moveSpeed; this.lastMoveDir = { x: 0, y: 1 }; }
        if (this.keys.has("a") || this.keys.has("arrowleft")) { dx -= moveSpeed; this.lastMoveDir = { x: -1, y: 0 }; }
        if (this.keys.has("d") || this.keys.has("arrowright")) { dx += moveSpeed; this.lastMoveDir = { x: 1, y: 0 }; }

        const newX = this.x + dx;
        if (!checkRectCollision(newX, this.y, this.playerSize, this.playerSize)) {
            this.x = newX;
        }

        const newY = this.y + dy;
        if (!checkRectCollision(this.x, newY, this.playerSize, this.playerSize)) {
            this.y = newY;
        }

        // Stamina regeneration when idle
        if (!this.staminaConsumedThisFrame) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.3);
        }

        if (this.constructWallTimer > 0) this.constructWallTimer--;
        if (this.abilityAnimTimer > 0) this.abilityAnimTimer--;
    }

    tryAttack(mob: Mob): boolean {
        if (this.stamina < 10) return false;
        this.stamina -= 10;
        this.staminaConsumedThisFrame = true;
        mob.loseHP(this);
        return true;
    }

    tryAbility(mobs: Mob[], bosses: import("./Boss.js").boss[]): boolean {
        if (!this.playerClass) return false;
        return this.playerClass.useAbility(this, mobs, bosses);
    }

    loseHP(mob: Mob) {
        let damage = mob.attackPower;
        if (this.equippedArmour?.name === "Strong Jacket") {
            damage *= 0.9;
        }
        this.health -= damage;
        this.damageFlashTimer = 8;
        if (this.health <= 0) {
            this.isPlayerDead = true;
            this.health = 0;
        }
    }

    loseHPFromBoss(damage: number) {
        if (this.equippedArmour?.name === "Strong Jacket") {
            damage *= 0.9;
        }
        this.health -= damage;
        this.damageFlashTimer = 8;
        if (this.health <= 0) {
            this.isPlayerDead = true;
            this.health = 0;
        }
    }

    increaseXP(amount: number) {
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);
        this.maxHealth += 10;
        this.maxStamina += 5;
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.baseSpeed = Math.min(10, this.baseSpeed + 0.2);
        this.speed = this.baseSpeed;
        this.extraStatPoints += 1;

        if (this.playerClass) {
            this.playerClass.applyLevelGrowth(this);
        }

        if (this.level >= 5 && !this.classChosen) {
            this.classSelect = true;
        }
    }

    selectClass(choice: string) {
        this.playerClass = new playerClasses(choice, this, this.level);
        this.classChosen = true;
        this.classSelect = false;
    }

    equipItem(item: Item) {
        const oldWeapon = this.equippedWeapon;
        const oldArmour = this.equippedArmour;

        if (item.type === "weapon") {
            this.unequipItem(oldWeapon);
            this.equippedWeapon = item;
        } else if (item.type === "armour") {
            this.unequipItem(oldArmour);
            this.equippedArmour = item;
        }

        this.applyStatBonus(item.statBonus);
    }

    unequipItem(item: Item | null) {
        if (!item) return;
        if (item.statBonus.mind) this.mind -= item.statBonus.mind;
        if (item.statBonus.body) this.body -= item.statBonus.body;
        if (item.statBonus.soul) this.soul -= item.statBonus.soul;
        if (item.statBonus.hp) {
            this.maxHealth -= item.statBonus.hp;
            this.health = Math.min(this.health, this.maxHealth);
        }
        if (item.statBonus.speed) {
            this.speed -= item.statBonus.speed;
            this.baseSpeed -= item.statBonus.speed;
        }
    }

    applyStatBonus(bonus: Partial<{ mind: number; body: number; soul: number; hp: number; speed: number }>) {
        if (bonus.mind) this.mind += bonus.mind;
        if (bonus.body) this.body += bonus.body;
        if (bonus.soul) this.soul += bonus.soul;
        if (bonus.hp) {
            this.maxHealth += bonus.hp;
            this.health += bonus.hp;
        }
        if (bonus.speed) {
            this.speed += bonus.speed;
            this.baseSpeed += bonus.speed;
        }
    }

    getAttackReach(): number {
        let reach = 0;
        if (this.equippedWeapon?.name === "Long Ruler") reach = 30;
        return reach;
    }

    draw(ctx: CanvasRenderingContext2D) {
        drawPlayer(ctx, this.x, this.y, this.playerSize, this.playerSize, playerPattern, this.playerColors);

        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
            this.damageFlashTimer--;
        }

        // Ability animations
        if (this.abilityAnimType === "persuade" && this.abilityAnimTimer > 0) {
            const ring = 3 - Math.floor(this.abilityAnimTimer / 8);
            const radius = (24 - this.abilityAnimTimer) * 8 + ring * 20;
            const alpha = this.abilityAnimTimer / 24 * 0.5;
            ctx.beginPath();
            ctx.arc(this.x + this.playerSize / 2, this.y + this.playerSize / 2, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(50, 100, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        if (this.abilityAnimType === "construct" && this.constructWallTimer > 0) {
            const alpha = this.constructWallTimer / 240;
            ctx.fillStyle = `rgba(255, 220, 50, ${alpha * 0.6})`;
            ctx.fillRect(this.constructWallX, this.constructWallY, 36, 36);
        }

        if (this.abilityAnimType === "bash" && this.abilityAnimTimer > 0) {
            const progress = 1 - this.abilityAnimTimer / 12;
            const radius = 80 * (1 - progress);
            ctx.beginPath();
            ctx.arc(this.x + this.playerSize / 2, this.y + this.playerSize / 2, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 140, 0, ${0.6 * (1 - progress)})`;
            ctx.fill();
        }
    }
}

export { playerPattern };
