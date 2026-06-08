import type { Player } from "../player.js";
export declare function setClassHover(mx: number, my: number, canvas: HTMLCanvasElement): void;
export declare function getClassFromClick(mx: number, my: number, canvas: HTMLCanvasElement): string | null;
export declare function drawClassSelect(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
export declare function drawHUD(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player, killCount: number): void;
export declare function drawControlsPanel(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void;
//# sourceMappingURL=HUD.d.ts.map