import type { Player } from "./player.js";
export declare class Mob {
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number;
    attackPower: number;
    mobHealth: number;
    constructor(mobX: number, mobY: number, level: number);
    attack(player: Player): void;
    loseHp(player: Player): void;
    mobMovement(player: Player): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=mob.d.ts.map