import type { Player } from "./player.js";
export declare class Mob {
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number;
    attackPower: number;
    mobHealth: number;
    isMobDead: boolean;
    constructor(mobX: number, mobY: number, level: number);
    loseHP(player: Player): void;
    mobMovement(player: Player): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=mob.d.ts.map