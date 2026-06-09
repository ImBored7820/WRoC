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

// this pattern is how the player sprite looks, each number represents a color
const playerPattern = [
    0, 0, 0, 0, 0, 0,  // head top (skin)
    0, 2, 0, 0, 2, 0,  // eyes (accent color)
    0, 1, 1, 1, 1, 0,  // torso
    0, 1, 2, 2, 1, 0,  // chest detail
    0, 1, 1, 1, 1, 0,  // torso lower
    0, 0, 1, 1, 0, 0,  // legs
];

export class Player {
    // position in the world
    x: number;
    y: number;
    playerSize: number;

    // movement stuff
    speed: number;
    baseSpeed: number; // before any bonuses
    health: number;
    stamina: number;

    // basic character info
    name: string;
    level: number;

    // experience points
    xp: number;
    xpToNextLevel: number;

    // maximum values for hp/stamina
    maxHealth: number;
    maxStamina: number;

    // character stats
    mind: number;
    body: number;
    soul: number;
    extraStatPoints: number; // points to spend when leveling

    // class selection state
    classSelect: boolean;
    classChosen: boolean;
    playerClass: playerClasses | null;

    // death and damage stuff
    isPlayerDead: boolean;
    damageFlashTimer: number; // makes player flash red when hurt

    // colors for drawing the player sprite
    playerColors: { [key: number]: string };

    // equipment slots
    equippedWeapon: Item | null;
    equippedArmour: Item | null;

    // status effects from miniboss abilities
    isFrozen: boolean; // cant move when frozen
    freezeTimer: number;
    inPaintZone: boolean; // slows movement
    knockbackVx: number; // velocity for knockback
    knockbackVy: number;
    knockbackTimer: number;

    // ability animation state
    abilityAnimType: string; // which animation to show
    abilityAnimTimer: number; // how long to show it
    constructWallX: number; // where construct wall ability was used
    constructWallY: number;
    constructWallTimer: number;
    lastMoveDir: { x: number; y: number }; // remembers which way player was facing

    // stamina management
    staminaConsumedThisFrame: boolean; // prevents stamina regen when using abilities
    sprintBlocked: boolean; // cant sprint when stamina too low

    public keys: Set<string> = new Set(); // which keys are pressed

    public constructor(x: number, y: number, level?: number, MBS?: number) {
        this.x = x;
        this.y = y;

        // MBS is mind-body-soul stats as a 3 digit number like 321
        if (MBS && MBS < 100) MBS = 111; // minimum valid stats
        else if (!MBS) MBS = 111;

        const mbsToString = MBS.toString();
        const temp = mbsToString.split("").map(Number);
        this.mind = temp[0];
        this.body = temp[1];
        this.soul = temp[2];
        this.extraStatPoints = 0;

        // basic setup
        this.playerSize = 30;
        this.name = "Player";

        // starting health and stamina
        this.maxHealth = 100;
        this.maxStamina = 100;
        this.health = this.maxHealth;
        this.stamina = this.maxStamina;
        this.speed = 6;
        this.baseSpeed = 6;

        // xp system
        this.xp = 0;
        this.level = level && level > 0 ? level : 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level); // doubles each level

        // class stuff starts false
        this.classSelect = false;
        this.classChosen = false;
        this.playerClass = null;
        this.isPlayerDead = false;
        this.damageFlashTimer = 0;

        // default skin and clothing colors
        this.playerColors = { 0: "#c8a888", 1: "#3366cc", 2: "#1a1a2a" };

        // no equipment at start
        this.equippedWeapon = null;
        this.equippedArmour = null;

        // reset all status effects
        this.isFrozen = false;
        this.freezeTimer = 0;
        this.inPaintZone = false;
        this.knockbackVx = 0;
        this.knockbackVy = 0;
        this.knockbackTimer = 0;

        // reset animations
        this.abilityAnimType = "";
        this.abilityAnimTimer = 0;
        this.constructWallX = 0;
        this.constructWallY = 0;
        this.constructWallTimer = 0;
        this.lastMoveDir = { x: 0, y: 1 }; // start facing down

        // stamina stuff
        this.staminaConsumedThisFrame = false;
        this.sprintBlocked = false;
    }

    setColors(skinColor: string, clothesColor: string) {
        // updates player appearance
        this.playerColors = { 0: skinColor, 1: clothesColor, 2: "#1a1a2a" };
    }

    movementKeys() {
        // sets up keyboard listeners for movement
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup", e => this.keys.delete(e.key.toLowerCase()));
    }

    update() {
        // dont do anything if choosing class or frozen
        if (this.classSelect || this.isFrozen) {
            if (this.isFrozen) {
                this.freezeTimer--;
                if (this.freezeTimer <= 0) this.isFrozen = false;
            }
            return;
        }

        this.staminaConsumedThisFrame = false;

        // handle knockback from boss attacks
        if (this.knockbackTimer > 0) {
            const newX = this.x + this.knockbackVx / 30;
            const newY = this.y + this.knockbackVy / 30;
            // only move if it wont cause collision
            if (!checkRectCollision(newX, this.y, this.playerSize, this.playerSize)) this.x = newX;
            if (!checkRectCollision(this.x, newY, this.playerSize, this.playerSize)) this.y = newY;
            this.knockbackTimer--;
            return;
        }

        let dx = 0;
        let dy = 0;
        const shiftHeld = this.keys.has("shift");
        const SPRINT_BONUS = 3; // how much faster sprinting is

        // sprinting uses stamina
        if (shiftHeld && !this.sprintBlocked) {
            this.stamina -= 0.5;
            this.staminaConsumedThisFrame = true;
            if (this.stamina <= 0) {
                this.stamina = 0;
                this.sprintBlocked = true; // need to wait for stamina to recover
            }
        }

        // can sprint again once stamina is decent
        if (this.sprintBlocked && this.stamina > 20) {
            this.sprintBlocked = false;
        }

        // calculate movement speed
        let moveSpeed = this.baseSpeed;
        if (shiftHeld && !this.sprintBlocked) moveSpeed += SPRINT_BONUS;
        if (this.inPaintZone) moveSpeed *= 0.5; // paint slows you down

        // check movement keys and remember direction
        if (this.keys.has("w") || this.keys.has("arrowup")) { dy -= moveSpeed; this.lastMoveDir = { x: 0, y: -1 }; }
        if (this.keys.has("s") || this.keys.has("arrowdown")) { dy += moveSpeed; this.lastMoveDir = { x: 0, y: 1 }; }
        if (this.keys.has("a") || this.keys.has("arrowleft")) { dx -= moveSpeed; this.lastMoveDir = { x: -1, y: 0 }; }
        if (this.keys.has("d") || this.keys.has("arrowright")) { dx += moveSpeed; this.lastMoveDir = { x: 1, y: 0 }; }

        // try to move horizontally first
        const newX = this.x + dx;
        if (!checkRectCollision(newX, this.y, this.playerSize, this.playerSize)) {
            this.x = newX;
        }

        // then try vertical movement
        const newY = this.y + dy;
        if (!checkRectCollision(this.x, newY, this.playerSize, this.playerSize)) {
            this.y = newY;
        }

        // slowly recover stamina when not using it
        if (!this.staminaConsumedThisFrame) {
            this.stamina = Math.min(this.maxStamina, this.stamina + 0.3);
        }

        // tick down ability timers
        if (this.constructWallTimer > 0) this.constructWallTimer--;
        if (this.abilityAnimTimer > 0) this.abilityAnimTimer--;
    }

    tryAttack(mob: Mob): boolean {
        // need stamina to attack
        if (this.stamina < 10) return false;
        this.stamina -= 10;
        this.staminaConsumedThisFrame = true;
        mob.loseHP(this);
        return true;
    }

    tryAbility(mobs: Mob[], bosses: import("./entities/Boss").boss[]): boolean {
        // need a class to use abilities
        if (!this.playerClass) return false;
        return this.playerClass.useAbility(this, mobs, bosses);
    }

    loseHP(mob: Mob) {
        // take damage from a mob attack
        let damage = mob.attackPower;
        if (this.equippedArmour?.name === "Strong Jacket") {
            damage *= 0.9; // armor reduces damage
        }
        this.health -= damage;
        this.damageFlashTimer = 8; // flash red when hurt
        if (this.health <= 0) {
            this.isPlayerDead = true;
            this.health = 0;
        }
    }

    loseHPFromBoss(damage: number) {
        // same as above but for boss attacks
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
        // add xp and check for level ups
        this.xp += amount;
        while (this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.levelUp();
        }
    }

    levelUp() {
        // level up and get stronger
        this.level++;
        this.xpToNextLevel = 100 * Math.pow(2, this.level); // xp requirement doubles
        this.maxHealth += 10;
        this.maxStamina += 5;
        this.health = this.maxHealth; // full heal on level up
        this.stamina = this.maxStamina;
        this.baseSpeed = Math.min(10, this.baseSpeed + 0.2); // get slightly faster
        this.speed = this.baseSpeed;
        this.extraStatPoints += 1; // get a stat point to spend

        // class gets stronger too
        if (this.playerClass) {
            this.playerClass.applyLevelGrowth(this);
        }

        // unlock class selection at level 5
        if (this.level >= 5 && !this.classChosen) {
            this.classSelect = true;
        }
    }

    selectClass(choice: string) {
        // pick a class and stop showing selection menu
        this.playerClass = new playerClasses(choice, this, this.level);
        this.classChosen = true;
        this.classSelect = false;
    }

    equipItem(item: Item) {
        // equip new gear and remove old stuff
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
        // remove stat bonuses from old gear
        if (!item) return;
        if (item.statBonus.mind) this.mind -= item.statBonus.mind;
        if (item.statBonus.body) this.body -= item.statBonus.body;
        if (item.statBonus.soul) this.soul -= item.statBonus.soul;
        if (item.statBonus.hp) {
            this.maxHealth -= item.statBonus.hp;
            this.health = Math.min(this.health, this.maxHealth); // dont go over new max
        }
        if (item.statBonus.speed) {
            this.speed -= item.statBonus.speed;
            this.baseSpeed -= item.statBonus.speed;
        }
    }

    applyStatBonus(bonus: Partial<{ mind: number; body: number; soul: number; hp: number; speed: number }>) {
        // add stat bonuses from new gear
        if (bonus.mind) this.mind += bonus.mind;
        if (bonus.body) this.body += bonus.body;
        if (bonus.soul) this.soul += bonus.soul;
        if (bonus.hp) {
            this.maxHealth += bonus.hp;
            this.health += bonus.hp; // get the hp immediately
        }
        if (bonus.speed) {
            this.speed += bonus.speed;
            this.baseSpeed += bonus.speed;
        }
    }

    getAttackReach(): number {
        // some weapons let you attack from farther away
        let reach = 0;
        if (this.equippedWeapon?.name === "Long Ruler") reach = 30;
        return reach;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // draw the player sprite
        drawPlayer(ctx, this.x, this.y, this.playerSize, this.playerSize, playerPattern, this.playerColors);

        // flash red when taking damage
        if (this.damageFlashTimer > 0) {
            ctx.fillStyle = "rgba(255, 50, 50, 0.5)";
            ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
            this.damageFlashTimer--;
        }

        // draw ability animations
        if (this.abilityAnimType === "persuade" && this.abilityAnimTimer > 0) {
            // expanding blue rings for persuade ability
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
            // show the constructed wall with fading effect
            const alpha = this.constructWallTimer / 240;
            ctx.fillStyle = `rgba(255, 220, 50, ${alpha * 0.6})`;
            ctx.fillRect(this.constructWallX, this.constructWallY, 36, 36);
        }

        if (this.abilityAnimType === "bash" && this.abilityAnimTimer > 0) {
            // expanding orange circle for bash ability
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