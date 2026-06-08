/**
 * Author: musa -
 * Date: 06/07/2026
 *
 * Description: Welcome screen for name and character customization
 * Info: WRoC | WelcomeScreen.ts | WebStorm
 */
import { drawPlayer } from "../../assets/drawPlayer.js";

const SKIN_SWATCHES = [
    "#f5d0a9", "#e8b88a", "#c68642", "#8d5524",
    "#ffdbac", "#c8a070", "#a07850", "#6b4423",
];

const CLOTHES_SWATCHES = [
    "#3366cc", "#cc3333", "#33aa55", "#8833aa",
    "#333333", "#eeeeee", "#ff8800", "#2266aa",
];

const playerPreviewPattern = [
    0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 1, 1, 1, 0,
    0, 1, 0, 0, 1, 0,
    0, 1, 0, 0, 1, 0,
];

export class WelcomeScreen {
    playerName: string;
    skinColor: string;
    clothesColor: string;
    isComplete: boolean;
    nameFocused: boolean;
    cursorBlink: number;
    showContinue: boolean;
    continuingFromSave: boolean;

    constructor() {
        this.playerName = "";
        this.skinColor = SKIN_SWATCHES[0];
        this.clothesColor = CLOTHES_SWATCHES[0];
        this.isComplete = false;
        this.nameFocused = false;
        this.cursorBlink = 0;
        this.showContinue = localStorage.getItem("wroc_save") !== null;
        this.continuingFromSave = false;
    }

    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
        ctx.fillStyle = "rgba(10, 10, 20, 0.95)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 36px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("Welcome to WRoC", canvas.width / 2, 80);

        const previewX = canvas.width / 2 - 250;
        const previewY = 160;
        const previewSize = 90;

        ctx.strokeStyle = "#555";
        ctx.lineWidth = 2;
        ctx.strokeRect(previewX - 10, previewY - 10, previewSize + 20, previewSize + 20);

        drawPlayer(ctx, previewX, previewY, previewSize, previewSize, playerPreviewPattern, {
            0: this.skinColor,
            1: this.clothesColor,
        });

        const fieldX = canvas.width / 2 - 80;
        const fieldY = 170;
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(fieldX, fieldY, 220, 36);
        ctx.strokeStyle = this.nameFocused ? "white" : "#666";
        ctx.strokeRect(fieldX, fieldY, 220, 36);
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "left";
        const displayName = this.playerName || "Enter name...";
        ctx.fillStyle = this.playerName ? "white" : "#888";
        ctx.fillText(displayName, fieldX + 10, fieldY + 24);

        if (this.nameFocused) {
            this.cursorBlink++;
            if (Math.floor(this.cursorBlink / 30) % 2 === 0) {
                const cursorX = fieldX + 10 + ctx.measureText(this.playerName).width;
                ctx.fillStyle = "white";
                ctx.fillRect(cursorX + 2, fieldY + 10, 2, 18);
            }
        }

        ctx.fillStyle = "#aaa";
        ctx.font = "14px monospace";
        ctx.fillText("Skin Color", fieldX, fieldY + 60);
        this.drawSwatches(ctx, fieldX, fieldY + 70, SKIN_SWATCHES, this.skinColor, "skin");

        ctx.fillText("Clothes Color", fieldX, fieldY + 130);
        this.drawSwatches(ctx, fieldX, fieldY + 140, CLOTHES_SWATCHES, this.clothesColor, "clothes");

        const btnY = canvas.height - 100;
        this.drawButton(ctx, canvas.width / 2 - 80, btnY, 160, 40, "Start Game");

        if (this.showContinue) {
            this.drawButton(ctx, canvas.width / 2 - 80, btnY - 55, 160, 40, "Continue");
        }
    }

    drawSwatches(ctx: CanvasRenderingContext2D, x: number, y: number, swatches: string[], selected: string, _type: string) {
        for (let i = 0; i < swatches.length; i++) {
            const sx = x + i * 28;
            ctx.fillStyle = swatches[i];
            ctx.fillRect(sx, y, 24, 24);
            if (swatches[i] === selected) {
                ctx.strokeStyle = "white";
                ctx.lineWidth = 2;
                ctx.strokeRect(sx - 1, y - 1, 26, 26);
            }
        }
    }

    drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string) {
        ctx.fillStyle = "rgba(60, 120, 200, 0.8)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x + w / 2, y + h / 2 + 6);
    }

    handleInput(e: KeyboardEvent) {
        if (this.isComplete) return;

        if (e.key === "Enter") {
            if (this.playerName.length > 0) this.isComplete = true;
            return;
        }

        if (!this.nameFocused) return;

        if (e.key === "Backspace") {
            this.playerName = this.playerName.slice(0, -1);
        } else if (e.key.length === 1 && this.playerName.length < 16) {
            this.playerName += e.key;
        }
    }

    handleClick(e: MouseEvent, canvas: HTMLCanvasElement) {
        if (this.isComplete) return;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const fieldX = canvas.width / 2 - 80;
        const fieldY = 170;
        if (mx >= fieldX && mx <= fieldX + 220 && my >= fieldY && my <= fieldY + 36) {
            this.nameFocused = true;
            return;
        }
        this.nameFocused = false;

        const skinY = fieldY + 70;
        for (let i = 0; i < SKIN_SWATCHES.length; i++) {
            const sx = fieldX + i * 28;
            if (mx >= sx && mx <= sx + 24 && my >= skinY && my <= skinY + 24) {
                this.skinColor = SKIN_SWATCHES[i];
                return;
            }
        }

        const clothesY = fieldY + 140;
        for (let i = 0; i < CLOTHES_SWATCHES.length; i++) {
            const sx = fieldX + i * 28;
            if (mx >= sx && mx <= sx + 24 && my >= clothesY && my <= clothesY + 24) {
                this.clothesColor = CLOTHES_SWATCHES[i];
                return;
            }
        }

        const btnY = canvas.height - 100;
        if (mx >= canvas.width / 2 - 80 && mx <= canvas.width / 2 + 80 && my >= btnY && my <= btnY + 40) {
            if (this.playerName.length > 0) this.isComplete = true;
            return;
        }

        if (this.showContinue) {
            const contY = btnY - 55;
            if (mx >= canvas.width / 2 - 80 && mx <= canvas.width / 2 + 80 && my >= contY && my <= contY + 40) {
                this.isComplete = true;
                this.continuingFromSave = true;
                this.playerName = JSON.parse(localStorage.getItem("wroc_save") || "{}").playerName || "Player";
            }
        }
    }

    getPlayerColors(): { [key: number]: string } {
        return { 0: this.skinColor, 1: this.clothesColor };
    }
}
