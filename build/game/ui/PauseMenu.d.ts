export interface PauseCallbacks {
    onResume: () => void;
    onRestart: () => void;
    onSaveQuit: () => void;
}
export declare class PauseMenu {
    isOpen: boolean;
    savedConfirmation: number;
    constructor();
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string): void;
    handleClick(e: MouseEvent, canvas: HTMLCanvasElement, callbacks: PauseCallbacks): void;
}
//# sourceMappingURL=PauseMenu.d.ts.map