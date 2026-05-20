import type { Player } from "./player.js";
export declare class Mob {
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number;
    name: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;
    mobHealth: number;
    isMobDead: boolean;
    constructor(mobX: number, mobY: number, level: number, name: number);
    loseHP(player: Player): void;
    mobMovement(player: Player): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=mob.d.ts.map