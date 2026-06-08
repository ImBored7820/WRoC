var ClassBaseStats;
(function (ClassBaseStats) {
    ClassBaseStats[ClassBaseStats["Language"] = 112] = "Language";
    ClassBaseStats[ClassBaseStats["STEM"] = 211] = "STEM";
    ClassBaseStats[ClassBaseStats["Sports"] = 121] = "Sports";
})(ClassBaseStats || (ClassBaseStats = {}));
function decodeMBS(mbs) {
    return {
        mind: Math.floor(mbs / 100),
        body: Math.floor((mbs % 100) / 10),
        soul: mbs % 10,
    };
}
const statGrowth = {
    Language: { mind: 0, body: 0, soul: 1 },
    STEM: { mind: 1, body: 0, soul: 0 },
    Sports: { mind: 0, body: 1, soul: 0 },
    None: { mind: 0, body: 0, soul: 0 },
};
const abilityCooldowns = {
    Persuade: 8000,
    Construct: 6000,
    Bash: 5000,
    none: 0,
};
export class playerClasses {
    className;
    specialAbility;
    playerLevel;
    abilityCooldown;
    lastAbilityUse;
    statGrowthPerLevel;
    constructor(userChoice, player, level) {
        this.className = userChoice;
        this.lastAbilityUse = 0;
        if (level >= 5) {
            if (userChoice == "Language") {
                const stats = decodeMBS(ClassBaseStats.Language);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Persuade";
            }
            else if (userChoice == "STEM") {
                const stats = decodeMBS(ClassBaseStats.STEM);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Construct";
            }
            else if (userChoice == "Sports") {
                const stats = decodeMBS(ClassBaseStats.Sports);
                player.mind = stats.mind;
                player.body = stats.body;
                player.soul = stats.soul;
                this.specialAbility = "Bash";
            }
            else {
                player.extraStatPoints = 1;
                this.specialAbility = "none";
            }
        }
        else {
            this.specialAbility = "none";
        }
        this.playerLevel = level;
        this.abilityCooldown = abilityCooldowns[this.specialAbility] ?? 0;
        this.statGrowthPerLevel = statGrowth[userChoice] ?? statGrowth.None;
    }
    applyLevelGrowth(player) {
        player.mind += this.statGrowthPerLevel.mind;
        player.body += this.statGrowthPerLevel.body;
        player.soul += this.statGrowthPerLevel.soul;
    }
    canUseAbility() {
        if (this.specialAbility === "none")
            return false;
        return performance.now() - this.lastAbilityUse >= this.abilityCooldown;
    }
    getCooldownRemaining() {
        const elapsed = performance.now() - this.lastAbilityUse;
        return Math.max(0, this.abilityCooldown - elapsed);
    }
    useAbility(player, mobs, bosses) {
        if (!this.canUseAbility())
            return false;
        if (player.stamina < 25)
            return false;
        player.stamina -= 25;
        this.lastAbilityUse = performance.now();
        if (this.specialAbility === "Persuade") {
            player.abilityAnimType = "persuade";
            player.abilityAnimTimer = 24;
            for (const mob of mobs) {
                const dx = mob.mobX - player.x;
                const dy = mob.mobY - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 200) {
                    mob.isStunned = true;
                    mob.stunTimer = 90;
                }
            }
            for (const b of bosses) {
                const dx = b.x - player.x;
                const dy = b.y - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 200) {
                    b.isStunned = true;
                    b.stunTimer = 90;
                }
            }
        }
        else if (this.specialAbility === "Construct") {
            player.abilityAnimType = "construct";
            player.abilityAnimTimer = 240;
            player.constructWallTimer = 240;
            const dir = player.lastMoveDir;
            player.constructWallX = player.x + dir.x * 36;
            player.constructWallY = player.y + dir.y * 36;
        }
        else if (this.specialAbility === "Bash") {
            player.abilityAnimType = "bash";
            player.abilityAnimTimer = 12;
            const damage = player.body * 5;
            for (const mob of mobs) {
                const dx = mob.mobX - player.x;
                const dy = mob.mobY - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 80) {
                    mob.mobHealth -= damage;
                    mob.damageFlashTimer = 8;
                    if (mob.mobHealth <= 0)
                        mob.isMobDead = true;
                }
            }
            for (const b of bosses) {
                const dx = b.x - player.x;
                const dy = b.y - player.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 80) {
                    b.health -= damage;
                    b.damageFlashTimer = 8;
                    if (b.health <= 0)
                        b.isDead = true;
                }
            }
        }
        return true;
    }
}
//# sourceMappingURL=playerClasses.js.map