/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: 7-slot inventory with player preview and stats,
 * This file is ALL AI
 * Info: WRoC | Inventory.ts | WebStorm
 */
import type { Player } from "../player.js";
import type { Item } from "../items/Item.js";
import { drawPlayer } from "../../assets/drawPlayer.js";

const playerPreviewPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0,
];

export class Inventory {
    isOpen: boolean;
    slots: (Item | null)[];

    constructor() {
        this.isOpen = false;
        this.slots = new Array(7).fill(null);
    }

    open() { this.isOpen = true; }
    close() { this.isOpen = false; }

    addItem(item: Item): boolean {
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i]) {
                this.slots[i] = item;
                return true;
            }
        }
        return false;
    }

    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, player: Player) {
        if (!this.isOpen) return;

        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const modalW = 520;
        const modalH = 400;
        const modalX = (canvas.width - modalW) / 2;
        const modalY = (canvas.height - modalH) / 2;

        ctx.fillStyle = "rgba(30, 30, 40, 0.95)";
        ctx.fillRect(modalX, modalY, modalW, modalH);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 2;
        ctx.strokeRect(modalX, modalY, modalW, modalH);

        // Close button
        ctx.fillStyle = "#ccc";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("[X]", modalX + modalW - 20, modalY + 22);

        // Left panel — player preview
        const previewX = modalX + 30;
        const previewY = modalY + 50;
        ctx.strokeStyle = "#555";
        ctx.strokeRect(previewX - 5, previewY - 5, 110, 110);
        drawPlayer(ctx, previewX, previewY, 90, 90, playerPreviewPattern, player.playerColors);

        ctx.fillStyle = "white";
        ctx.font = "13px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Name: " + player.name, previewX, previewY + 125);
        ctx.fillText("Class: " + (player.playerClass?.className ?? "None"), previewX, previewY + 145);
        ctx.fillText("Level: " + player.level, previewX, previewY + 165);
        ctx.fillText("Stat Points: " + player.extraStatPoints, previewX, previewY + 185);

        // Right panel — stats
        const statsX = modalX + 200;
        ctx.font = "14px monospace";
        ctx.fillText("Mind: " + player.mind, statsX, modalY + 70);
        ctx.fillText("Body: " + player.body, statsX, modalY + 95);
        ctx.fillText("Soul: " + player.soul, statsX, modalY + 120);
        ctx.fillText("HP: " + player.health + "/" + player.maxHealth, statsX, modalY + 145);
        ctx.fillText("Stamina: " + Math.floor(player.stamina) + "/" + player.maxStamina, statsX, modalY + 170);

        // Bottom strip — 7 item slots
        const slotY = modalY + modalH - 100;
        const slotStartX = modalX + (modalW - 7 * 68) / 2;
        for (let i = 0; i < 7; i++) {
            const sx = slotStartX + i * 68;
            const item = this.slots[i];

            if (item) {
                ctx.fillStyle = "rgba(50,50,60,0.8)";
                ctx.fillRect(sx, slotY, 60, 60);
                ctx.strokeStyle = "#888";
                ctx.strokeRect(sx, slotY, 60, 60);
                item.draw(ctx, sx + 10, slotY + 10, 40);
                ctx.fillStyle = "#aaa";
                ctx.font = "8px monospace";
                ctx.textAlign = "center";
                ctx.fillText(item.name, sx + 30, slotY + 72);

                if (item === player.equippedWeapon || item === player.equippedArmour) {
                    ctx.fillStyle = "gold";
                    ctx.font = "12px monospace";
                    ctx.fillText("★", sx + 6, slotY + 14);
                }
            } else {
                ctx.setLineDash([4, 4]);
                ctx.strokeStyle = "#444";
                ctx.strokeRect(sx, slotY, 60, 60);
                ctx.setLineDash([]);
            }
        }
    }

    handleClick(e: MouseEvent, canvas: HTMLCanvasElement, player: Player) {
        if (!this.isOpen) return;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const modalW = 520;
        const modalH = 400;
        const modalX = (canvas.width - modalW) / 2;
        const modalY = (canvas.height - modalH) / 2;

        // Close button
        if (mx >= modalX + modalW - 35 && mx <= modalX + modalW - 5 && my >= modalY + 5 && my <= modalY + 30) {
            this.close();
            return;
        }

        const slotY = modalY + modalH - 100;
        const slotStartX = modalX + (modalW - 7 * 68) / 2;
        for (let i = 0; i < 7; i++) {
            const sx = slotStartX + i * 68;
            if (mx >= sx && mx <= sx + 60 && my >= slotY && my <= slotY + 60) {
                const item = this.slots[i];
                if (item) {
                    player.equipItem(item);
                }
            }
        }
    }
}
