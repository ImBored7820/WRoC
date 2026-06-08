export interface Item {
    name: string;
    type: "weapon" | "armour";
    statBonus: Partial<{
        mind: number;
        body: number;
        soul: number;
        hp: number;
        speed: number;
    }>;
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}
export declare class SharpPencil implements Item {
    name: string;
    type: "weapon";
    statBonus: {
        soul: number;
        mind: number;
    };
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}
export declare class LongRuler implements Item {
    name: string;
    type: "weapon";
    statBonus: {
        body: number;
    };
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}
export declare class TrackShoes implements Item {
    name: string;
    type: "armour";
    statBonus: {
        speed: number;
    };
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}
export declare class StrongJacket implements Item {
    name: string;
    type: "armour";
    statBonus: {
        body: number;
        hp: number;
    };
    draw(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void;
}
//# sourceMappingURL=Item.d.ts.map