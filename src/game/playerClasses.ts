/**
 * Author: 2030971 -
 * Date: 03/23/2026
 *
 * Description: Player class definitions with abilities and stat growth
 * Info: WRoC | playerClasses.ts | WebStorm
 */
import type { Player } from "./player.js";
import type { Mob } from "./entities/mob.js";
import type { boss } from "./entities/Boss.js";

// these are the starting stats for each class - encoded as 3-digit numbers
// first digit is mind, second is body, third is soul
enum ClassBaseStats {
    Language = 112, // 1 mind, 1 body, 2 soul - language students are more soulful
    STEM = 211,     // 2 mind, 1 body, 1 soul - STEM students are brainy
    Sports = 121,   // 1 mind, 2 body, 1 soul - sports students are strong
}

// helper function to break down those 3-digit stat codes into actual numbers
function decodeMBS(mbs: number): { mind: number; body: number; soul: number } {
    return {
        mind: Math.floor(mbs / 100),        // first digit
        body: Math.floor((mbs % 100) / 10), // middle digit
        soul: mbs % 10,                     // last digit
    };
}

// how much each class grows per level - pretty straightforward
const statGrowth: { [key: string]: { mind: number; body: number; soul: number } } = {
    Language: { mind: 0, body: 0, soul: 1 }, // language kids get more creative
    STEM: { mind: 1, body: 0, soul: 0 },     // STEM kids get smarter
    Sports: { mind: 0, body: 1, soul: 0 },   // sports kids get stronger
    None: { mind: 0, body: 0, soul: 0 },     // no class means no growth
};

// cooldown times for special abilities in milliseconds
const abilityCooldowns: { [key: string]: number } = {
    Persuade: 8000,  // 8 seconds - talking takes time
    Construct: 6000, // 6 seconds - building stuff is quick
    Bash: 5000,      // 5 seconds - punching is fast
    none: 0,         // no ability means no cooldown
};

export class playerClasses {
    className: string;
    specialAbility: string;
    playerLevel: number;
    abilityCooldown: number;
    lastAbilityUse: number;
    statGrowthPerLevel: { mind: number; body: number; soul: number };

    constructor(userChoice: string, player: Player, level: number) {
        this.className = userChoice;
        this.lastAbilityUse = 0; // haven't used any abilities yet

        // only get special abilities and base stats if you're level 5 or higher
        if (level >= 5) {
            if (userChoice == "Language") {
                const stats = decodeMBS(ClassBaseStats.Language);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Persuade"; // talk your way out of trouble
            } else if (userChoice == "STEM") {
                const stats = decodeMBS(ClassBaseStats.STEM);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Construct"; // build walls
            } else if (userChoice == "Sports") {
                const stats = decodeMBS(ClassBaseStats.Sports);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Bash"; // punch things
            } else {
                // if you pick up items, you get a free stat point instead
                player.extraStatPoints = 1;
                this.specialAbility = "none";
            }
        } else {
            // too low level for abilities
            this.specialAbility = "none";
        }

        this.playerLevel = level;
        this.abilityCooldown = abilityCooldowns[this.specialAbility] ?? 0;
        this.statGrowthPerLevel = statGrowth[userChoice] ?? statGrowth.None;
    }

    // called when the player levels up to boost their stats
    applyLevelGrowth(player: Player) {
        player.mind += this.statGrowthPerLevel.mind;
        player.body += this.statGrowthPerLevel.body;
        player.soul += this.statGrowthPerLevel.soul;
    }

    // check if enough time has passed since the last ability use
    canUseAbility(): boolean {
        if (this.specialAbility === "none") return false;
        return performance.now() - this.lastAbilityUse >= this.abilityCooldown;
    }

    // how much time is left before you can use your ability again
    getCooldownRemaining(): number {
        const elapsed = performance.now() - this.lastAbilityUse;
        return Math.max(0, this.abilityCooldown - elapsed);
    }

    // main ability system, each class does something different
    useAbility(player: Player, mobs: Mob[], bosses: boss[]): boolean {
        if (!this.canUseAbility()) return false; // still cooling down
        if (player.stamina < 25) return false;   // not enough energy

        // all abilities cost stamina to use
        player.stamina -= 25;
        this.lastAbilityUse = performance.now();

        if (this.specialAbility === "Persuade") {
            // language students can stun enemies by talking to them
            player.abilityAnimType = "persuade";
            player.abilityAnimTimer = 24;
            // check all mobs within range and stun them
            for (const mob of mobs) {
                const dx = mob.mobX - player.x;
                const dy = mob.mobY - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 200) { // 200px range
                    mob.isStunned = true;
                    mob.stunTimer = 90; // stunned for 90 frames
                }
            }
            // do the same for bosses
            for (const b of bosses) {
                const dx = b.x - player.x;
                const dy = b.y - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 200) {
                    b.isStunned = true;
                    b.stunTimer = 90;
                }
            }
        } else if (this.specialAbility === "Construct") {
            // STEM students can build temporary walls
            player.abilityAnimType = "construct";
            player.abilityAnimTimer = 240;
            player.constructWallTimer = 240; // wall lasts for 240 frames
            // place the wall in front of where the player last moved
            const dir = player.lastMoveDir;
            player.constructWallX = player.x + dir.x * 36; // one tile away
            player.constructWallY = player.y + dir.y * 36;
        } else if (this.specialAbility === "Bash") {
            // sports students can punch everything nearby really hard
            player.abilityAnimType = "bash";
            player.abilityAnimTimer = 12;
            const damage = player.body * 5; // damage scales with body stat
            // hit all mobs in close range
            for (const mob of mobs) {
                const dx = mob.mobX - player.x;
                const dy = mob.mobY - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 80) { // smaller range than persuade
                    mob.mobHealth -= damage;
                    mob.damageFlashTimer = 8; // flash red when hit
                    if (mob.mobHealth <= 0) mob.isMobDead = true;
                }
            }
            // same for bosses
            for (const b of bosses) {
                const dx = b.x - player.x;
                const dy = b.y - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 80) {
                    b.health -= damage;
                    b.damageFlashTimer = 8;
                    if (b.health <= 0) b.isDead = true;
                }
            }
        }

        return true; // ability was successfully used
    }
}