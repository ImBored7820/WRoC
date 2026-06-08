export class PauseMenu {
    isOpen;
    savedConfirmation;
    constructor() {
        this.isOpen = false;
        this.savedConfirmation = 0;
    }
    draw(ctx, canvas) {
        if (!this.isOpen)
            return;
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Georgia, serif";
        ctx.textAlign = "center";
        ctx.fillText("Paused", canvas.width / 2, canvas.height / 2 - 80);
        const btnW = 180;
        const btnH = 44;
        const cx = canvas.width / 2 - btnW / 2;
        this.drawButton(ctx, cx, canvas.height / 2 - 30, btnW, btnH, "Resume");
        this.drawButton(ctx, cx, canvas.height / 2 + 30, btnW, btnH, "Restart");
        this.drawButton(ctx, cx, canvas.height / 2 + 90, btnW, btnH, "Save & Quit");
        if (this.savedConfirmation > 0) {
            ctx.fillStyle = "limegreen";
            ctx.font = "18px monospace";
            ctx.fillText("Saved!", canvas.width / 2, canvas.height / 2 + 160);
            this.savedConfirmation--;
        }
    }
    drawButton(ctx, x, y, w, h, label) {
        ctx.fillStyle = "rgba(50, 80, 120, 0.9)";
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = "white";
        ctx.font = "16px monospace";
        ctx.textAlign = "center";
        ctx.fillText(label, x + w / 2, y + h / 2 + 6);
    }
    handleClick(e, canvas, callbacks) {
        if (!this.isOpen)
            return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const btnW = 180;
        const btnH = 44;
        const cx = canvas.width / 2 - btnW / 2;
        if (mx >= cx && mx <= cx + btnW && my >= canvas.height / 2 - 30 && my <= canvas.height / 2 - 30 + btnH) {
            this.isOpen = false;
            callbacks.onResume();
        }
        else if (mx >= cx && mx <= cx + btnW && my >= canvas.height / 2 + 30 && my <= canvas.height / 2 + 30 + btnH) {
            callbacks.onRestart();
        }
        else if (mx >= cx && mx <= cx + btnW && my >= canvas.height / 2 + 90 && my <= canvas.height / 2 + 90 + btnH) {
            callbacks.onSaveQuit();
            this.savedConfirmation = 90;
        }
    }
}
//# sourceMappingURL=PauseMenu.js.map