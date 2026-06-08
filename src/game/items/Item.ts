/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Equipment items with pixel-art icons, no point in commenting
 * all pretty intuitive, mostly art and stat bnouses
 * Info: WRoC | Item.ts | WebStorm
 */

import { drawPlayer } from "../../assets/drawPlayer.js";

export interface Item {
    name: string;
    type: "weapon" | "armour";
    statBonus: Partial<{ mind: number; body: number; soul: number; hp: number; speed: number }>;
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}

function drawItemIcon(
    ctx: CanvasRenderingContext2D, x: number, y: number, size: number,
    pattern: number[], colors: { [key: number]: string }
) {
    drawPlayer(ctx, x, y, size, size, pattern, colors);
}

const pencilPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 1,
    0, 0, 0, 0, 1, 2,
    0, 0, 0, 1, 2, 0,
    0, 0, 1, 2, 0, 0,
    0, 1, 2, 0, 0, 0,
];

const rulerPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1,
    2, 1, 2, 1, 2, 1,
    1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0,
];

const shoePattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 0,
    0, 0, 1, 1, 2, 0,
    0, 1, 1, 1, 1, 0,
    2, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0,
];

const jacketPattern = [
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 2, 2, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0,
];

export class SharpPencil implements Item {
    name = "Sharp Pencil";
    type = "weapon" as const;
    statBonus = { soul: 2, mind: 1 };

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        drawItemIcon(ctx, x, y, size, pencilPattern, {
            0: "#e8c860", 1: "#f0a0a0", 2: "#333333",
        });
    }
}

export class LongRuler implements Item {
    name = "Long Ruler";
    type = "weapon" as const;
    statBonus = { body: 3 };

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        drawItemIcon(ctx, x, y, size, rulerPattern, {
            0: "#aaaaaa", 1: "#dddddd", 2: "#888888",
        });
    }
}

export class TrackShoes implements Item {
    name = "Track Shoes";
    type = "armour" as const;
    statBonus = { speed: 2 };

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        drawItemIcon(ctx, x, y, size, shoePattern, {
            0: "#cc3333", 1: "#eeeeee", 2: "#444444",
        });
    }
}

export class StrongJacket implements Item {
    name = "Strong Jacket";
    type = "armour" as const;
    statBonus = { body: 2, hp: 20 };

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
        drawItemIcon(ctx, x, y, size, jacketPattern, {
            0: "#1a2a4a", 1: "#2a3a5a", 2: "#cccccc",
        });
    }
}
