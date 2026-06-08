import type { Player } from "../player.js";
import type { Item } from "../items/Item.js";
export declare class Inventory {
    isOpen: boolean;
    slots: (Item | null)[];
    constructor();
    open(): void;
    close(): void;
    addItem(item: Item): boolean;
    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player): void;
    handleClick(e: MouseEvent, canvas: HTMLCanvasElement, player: Player): void;
}
//# sourceMappingURL=Inventory.d.ts.map