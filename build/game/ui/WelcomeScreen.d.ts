export declare class WelcomeScreen {
    playerName: string;
    skinColor: string;
    clothesColor: string;
    isComplete: boolean;
    nameFocused: boolean;
    cursorBlink: number;
    showContinue: boolean;
    continuingFromSave: boolean;
    constructor();
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
    drawSwatches(ctx: CanvasRenderingContext2D, x: number, y: number, swatches: string[], selected: string, _type: string): void;
    drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string): void;
    handleInput(e: KeyboardEvent): void;
    handleClick(e: MouseEvent, canvas: HTMLCanvasElement): void;
    getPlayerColors(): {
        [key: number]: string;
    };
}
//# sourceMappingURL=WelcomeScreen.d.ts.map