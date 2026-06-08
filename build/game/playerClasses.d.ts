import type { Player } from "./player.js";
import type { Mob } from "./entities/mob.js";
import type { boss } from "./Boss.js";
export declare class playerClasses {
    className: string;
    specialAbility: string;
    playerLevel: number;
    abilityCooldown: number;
    lastAbilityUse: number;
    statGrowthPerLevel: {
        mind: number;
        body: number;
        soul: number;
    };
    constructor(userChoice: string, player: Player, level: number);
    applyLevelGrowth(player: Player): void;
    canUseAbility(): boolean;
    getCooldownRemaining(): number;
    useAbility(player: Player, mobs: Mob[], bosses: boss[]): boolean;
}
//# sourceMappingURL=playerClasses.d.ts.map