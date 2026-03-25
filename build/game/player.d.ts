import { playerClasses } from "./playerClasses.js";
export declare class Player {
    x: number;
    y: number;
    playerSize: number;
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    health: number;
    maxHealth: number;
    stamina: number;
    maxStamina: number;
    mind: number;
    body: number;
    soul: number;
    extraStatPoints: number;
    showClassSelect: boolean;
    classChosen: boolean;
    playerClass: playerClasses | null;
    private sprite;
    private keys;
    constructor(x: number, y: number, level?: number, MBS?: number);
    movementKeys(): void;
    update(): void;
    gainXP(amount: number): void;
    selectClass(choice: string): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=player.d.ts.map