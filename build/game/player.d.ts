export declare class Player {
    x: number;
    y: number;
    mind: number;
    body: number;
    soul: number;
    private sprite;
    private keys;
    constructor(x: number, y: number, MBS?: number);
    movementKeys(): void;
    update(): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
//# sourceMappingURL=player.d.ts.map