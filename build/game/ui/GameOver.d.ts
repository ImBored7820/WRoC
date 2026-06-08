export declare class GameOverScreen {
    isShowing: boolean;
    constructor();
    show(): void;
    hide(): void;
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, playerName: string, level: number, killCount: number): void;
    drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string): void;
    handleClick(e: MouseEvent, canvas: HTMLCanvasElement): "respawn" | "menu" | null;
}
//# sourceMappingURL=GameOver.d.ts.map