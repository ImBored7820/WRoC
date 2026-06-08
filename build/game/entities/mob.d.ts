import type { Player } from "../player.js";
declare const BASE_MOB_HEALTH = 60;
declare const BASE_MOB_ATTACK = 8;
export declare class Mob {
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number;
    name: string;
    mobType: string;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;
    mobHealth: number;
    maxMobHealth: number;
    moveSpeed: number;
    isMobDead: boolean;
    homeRoomId: number;
    damageFlashTimer: number;
    isStunned: boolean;
    stunTimer: number;
    wanderDirX: number;
    wanderDirY: number;
    wanderTimer: number;
    protected pattern: number[];
    protected colorMap: {
        [key: number]: string;
    };
    constructor(mobX: number, mobY: number, level: number, homeRoomId: number, mobType: string, pattern: number[], colorMap: {
        [key: number]: string;
    }, moveSpeed?: number, attackPower?: number, health?: number);
    loseHP(player: Player): void;
    mobMovement(player: Player): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
export declare class ZombieMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number);
}
export declare class SkeletonMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number);
}
export declare class HallMonitorMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number);
}
export declare class TeacherMob extends Mob {
    constructor(x: number, y: number, level: number, homeRoomId: number, playerLevel: number);
}
export { BASE_MOB_HEALTH, BASE_MOB_ATTACK };
//# sourceMappingURL=mob.d.ts.map