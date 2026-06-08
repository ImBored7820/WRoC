import { drawPlayer } from "../../assets/drawPlayer.js";
function drawItemIcon(ctx, x, y, size, pattern, colors) {
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
export class SharpPencil {
    name = "Sharp Pencil";
    type = "weapon";
    statBonus = { soul: 2, mind: 1 };
    draw(ctx, x, y, size) {
        drawItemIcon(ctx, x, y, size, pencilPattern, {
            0: "#e8c860", 1: "#f0a0a0", 2: "#333333",
        });
    }
}
export class LongRuler {
    name = "Long Ruler";
    type = "weapon";
    statBonus = { body: 3 };
    draw(ctx, x, y, size) {
        drawItemIcon(ctx, x, y, size, rulerPattern, {
            0: "#aaaaaa", 1: "#dddddd", 2: "#888888",
        });
    }
}
export class TrackShoes {
    name = "Track Shoes";
    type = "armour";
    statBonus = { speed: 2 };
    draw(ctx, x, y, size) {
        drawItemIcon(ctx, x, y, size, shoePattern, {
            0: "#cc3333", 1: "#eeeeee", 2: "#444444",
        });
    }
}
export class StrongJacket {
    name = "Strong Jacket";
    type = "armour";
    statBonus = { body: 2, hp: 20 };
    draw(ctx, x, y, size) {
        drawItemIcon(ctx, x, y, size, jacketPattern, {
            0: "#1a2a4a", 1: "#2a3a5a", 2: "#cccccc",
        });
    }
}
//# sourceMappingURL=Item.js.map