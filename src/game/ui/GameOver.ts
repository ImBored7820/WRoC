/**
 * Author: musa -
 * Date: 06/04/2026
 *
 * Description: Game over screen with respawn and main menu options. this files all AI
 * Info: WRoC | GameOver.ts | WebStorm
 */
export class GameOverScreen {
    isShowing: boolean;

    constructor() {
        this.isShowing = false;
    }

    show() { this.isShowing = true; }
    hide() { this.isShowing = false; }

    draw(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, playerName: string, level: number, killCount: number) {
        if (!this.isShowing) return;

        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, "rgba(80, 0, 0, 0.85)");
        gradient.addColorStop(1, "rgba(20, 0, 0, 0.95)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 48px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 60);

        ctx.font = "18px monospace";
        ctx.fillText(`${playerName}  —  Level ${level}  —  ${killCount} kills`, canvas.width / 2, canvas.height / 2);

        this.drawButton(ctx, canvas.width / 2 - 80, canvas.height / 2 + 40, 160, 44, "Respawn");
        this.drawButton(ctx, canvas.width / 2 - 80, canvas.height / 2 + 100, 160, 44, "Main Menu");
    }

    drawButton(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, label: string) {
        ctx.fillStyle = "rgba(180, 40, 40, 0.8)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x + w / 2, y + h / 2 + 6);
    }

    handleClick(e: MouseEvent, canvas: HTMLCanvasElement): "respawn" | "menu" | null {
        if (!this.isShowing) return null;

        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        if (mx >= cx - 80 && mx <= cx + 80 && my >= cy + 40 && my <= cy + 84) return "respawn";
        if (mx >= cx - 80 && mx <= cx + 80 && my >= cy + 100 && my <= cy + 144) return "menu";
        return null;
    }
}
