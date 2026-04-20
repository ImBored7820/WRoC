import { playerClasses } from "./playerClasses.js";
import { Mob } from "./mob.js";
export declare class Player {
    x: number;
    y: number;
    playerSize: number;
    speed: number;
    health: number;
    stamina: number;
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    maxHealth: number;
    maxStamina: number;
    mind: number;
    body: number;
    soul: number;
    extraStatPoints: number;
    classSelect: boolean;
    classChosen: boolean;
    playerClass: playerClasses | null;
    isPlayerDead: boolean;
    private sprite;
    keys: Set<string>;
    constructor(x: number, y: number, level?: number, MBS?: number);
    movementKeys(): void;
    update(): void;
    loseHP(mob: Mob): void;
    increaseXP(amount: number): void;
    selectClass(choice: string): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=player.d.ts.map