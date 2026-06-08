import { boss } from "../Boss.js";
import type { Player } from "../player.js";
import type { Item } from "../items/Item.js";
export interface PaintZone {
    x: number;
    y: number;
    radius: number;
    timer: number;
    color: string;
}
export declare class MiniBoss extends boss {
    xpReward: number;
    dropItem: () => Item;
    defeatedBannerTimer: number;
    dropProcessed: boolean;
    paintZones: PaintZone[];
    constructor(x: number, y: number, name: string, homeRoomId: number, maxHealth: number, attackPower: number, specialAbility: string, specialCooldown: number, xpReward: number, dropItem: () => Item);
    getPattern(): number[];
    getColorMap(): {
        [key: number]: string;
    };
    draw(ctx: CanvasRenderingContext2D): void;
    onDeath(): void;
}
export declare class MsInksworth extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number);
    getColorMap(): {
        [key: number]: string;
    };
    specialAttack(_player: Player): void;
}
export declare class CoachBrutus extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number);
    getColorMap(): {
        [key: number]: string;
    };
    specialAttack(player: Player): void;
}
export declare class VicePrincipalStern extends MiniBoss {
    constructor(x: number, y: number, homeRoomId: number);
    getColorMap(): {
        [key: number]: string;
    };
    specialAttack(player: Player): void;
}
//# sourceMappingURL=MiniBosses.d.ts.map