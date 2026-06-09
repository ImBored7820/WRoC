import type { Player } from "../player.js";
export declare class boss {
    x: number;
    y: number;
    type: string;
    name: string;
    isDead: boolean;
    health: number;
    maxHealth: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;
    bossSize: number;
    homeRoomId: number;
    damageFlashTimer: number;
    specialAbility: string;
    specialAttackCooldown: number;
    lastSpecialAttack: number;
    shockwaveTimer: number;
    shockwaveRadius: number;
    isStunned: boolean;
    stunTimer: number;
    constructor(x: number, y: number, type: string, name: string, homeRoomId?: number);
    loseHP(player: Player): void;
    specialAttack(player: Player): void;
    bossMovement(player: Player): void;
    tryNormalAttack(player: Player): boolean;
    getColorMap(): {
        [key: number]: string;
    };
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=Boss.d.ts.map