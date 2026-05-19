export declare const defaultPattern: number[];
export declare function drawTrisect(ctx: CanvasRenderingContext2D, x: number, y: number, roomOnePattern?: number[], roomOneColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}, roomTwoPattern?: number[], roomTwoColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}, roomThreePattern?: number[], roomThreeColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}): void;
//# sourceMappingURL=drawTrisect.d.ts.map