import type { Player } from "./player.js";
export declare class boss {
    x: number;
    y: number;
    type: string;
    name: string;
    isDead: boolean;
    health: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;
    bossSize: number;
    constructor(x: number, y: number, type: string, name: string);
    loseHP(player: Player): void;
    specialAttack(player: Player): void;
    bossMovement(player: Player): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Boss.d.ts.map