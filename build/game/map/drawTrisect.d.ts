export declare function withPassages(pattern: number[]): number[];
export declare const defaultPattern: number[];
export declare const roomPattern: number[];
export interface TrisectResult {
    roomIds: [number, number, number];
}
export declare function drawTrisect(ctx: CanvasRenderingContext2D, x: number, y: number, roomOnePattern?: number[], roomOneColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}, roomTwoPattern?: number[], roomTwoColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}, roomThreePattern?: number[], roomThreeColors?: {
    [key: number]: (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => void;
}, roomTypes?: ["room" | "hallway", "room" | "hallway", "room" | "hallway"]): TrisectResult;
export declare const hallwayPattern: number[];
export interface HallwayResult {
    roomId: number;
}
export declare function drawHallway(ctx: CanvasRenderingContext2D, x: number, y: number, widthTiles: number, heightTiles?: number): HallwayResult;
//# sourceMappingURL=drawTrisect.d.ts.map