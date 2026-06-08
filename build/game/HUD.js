let classHoverIndex = -1;
export function setClassHover(mx, my, canvas) {
    const cards = getClassCardRects(canvas);
    classHoverIndex = -1;
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) {
            classHoverIndex = i;
            break;
        }
    }
}
function getClassCardRects(canvas) {
    const cardW = 220;
    const cardH = 140;
    const gap = 20;
    const totalW = cardW * 2 + gap;
    const startX = (canvas.width - totalW) / 2;
    const startY = canvas.height / 2 - 60;
    return [
        { x: startX, y: startY, w: cardW, h: cardH },
        { x: startX + cardW + gap, y: startY, w: cardW, h: cardH },
        { x: startX, y: startY + cardH + gap, w: cardW, h: cardH },
        { x: startX + cardW + gap, y: startY + cardH + gap, w: cardW, h: cardH },
    ];
}
export function getClassFromClick(mx, my, canvas) {
    const classes = ["Language", "STEM", "Sports", "None"];
    const cards = getClassCardRects(canvas);
    for (let i = 0; i < cards.length; i++) {
        const c = cards[i];
        if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) {
            return classes[i];
        }
    }
    return null;
}
const classCardData = [
    { name: "Language", focus: "Soul focused", ability: "Q: Persuade — Stun nearby enemies", key: "1", color: "#3366cc" },
    { name: "STEM", focus: "Mind focused", ability: "Q: Construct — Erect temporary wall", key: "2", color: "#33aa55" },
    { name: "Sports", focus: "Body focused", ability: "Q: Bash — AoE body damage", key: "3", color: "#ff8800" },
    { name: "None", focus: "Balanced", ability: "Extra stat point on select", key: "4", color: "#888888" },
];
export function drawClassSelect(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.font = "bold 28px Georgia, serif";
    ctx.textAlign = "center";
    ctx.fillText("Choose Your Path", canvas.width / 2, canvas.height / 2 - 180);
    const cards = getClassCardRects(canvas);
    for (let i = 0; i < classCardData.length; i++) {
        const card = classCardData[i];
        const c = cards[i];
        const hovered = classHoverIndex === i;
        ctx.fillStyle = hovered ? "rgba(40, 40, 50, 0.95)" : "rgba(25, 25, 35, 0.95)";
        ctx.fillRect(c.x, c.y, c.w, c.h);
        ctx.strokeStyle = hovered ? card.color : "rgba(255,255,255,0.3)";
        ctx.lineWidth = hovered ? 3 : 1;
        ctx.strokeRect(c.x, c.y, c.w, c.h);
        ctx.fillStyle = card.color;
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "left";
        ctx.fillText(card.name, c.x + 14, c.y + 28);
        ctx.fillStyle = "#aaa";
        ctx.font = "11px monospace";
        ctx.fillText(card.focus, c.x + 14, c.y + 48);
        ctx.fillText(card.ability, c.x + 14, c.y + 68);
        ctx.fillStyle = "white";
        ctx.font = "bold 28px monospace";
        ctx.textAlign = "right";
        ctx.fillText("[" + card.key + "]", c.x + c.w - 14, c.y + 30);
    }
}
export function drawHUD(ctx, canvas, player, killCount) {
    const barWidth = 200;
    const padding = 20;
    const barX = canvas.width - barWidth - padding;
    let curY = padding;
    const panelH = player.classChosen ? 168 : 130;
    ctx.fillStyle = "rgba(12, 12, 20, 0.75)";
    roundRect(ctx, barX - 10, curY - 6, barWidth + 20, panelH, 6);
    ctx.fill();
    ctx.strokeStyle = "rgba(240, 192, 64, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const badgeW = 110;
    const badgeH = 28;
    ctx.fillStyle = "rgba(20, 20, 30, 0.85)";
    roundRect(ctx, 16, 244, badgeW, badgeH, 14);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.font = "13px monospace";
    ctx.textAlign = "left";
    ctx.fillText("⚔ " + killCount + " kills", 26, 263);
    ctx.fillStyle = "white";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(player.name, barX, curY + 14);
    ctx.textAlign = "right";
    ctx.fillText("Lvl " + player.level, barX + barWidth, curY + 14);
    curY += 22;
    const xpBarHeight = 4;
    const xpPercent = player.xp / player.xpToNextLevel;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, xpBarHeight);
    ctx.fillStyle = "limegreen";
    ctx.fillRect(barX, curY, barWidth * xpPercent, xpBarHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, curY, barWidth, xpBarHeight);
    curY += xpBarHeight + 6;
    const hpBarHeight = 14;
    const hpPercent = player.health / player.maxHealth;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, hpBarHeight);
    ctx.fillStyle = "crimson";
    ctx.fillRect(barX, curY, barWidth * hpPercent, hpBarHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, curY, barWidth, hpBarHeight);
    ctx.fillStyle = "white";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("HP: " + player.health + "/" + player.maxHealth, barX + barWidth / 2, curY + 11);
    curY += hpBarHeight + 4;
    const spBarHeight = 10;
    const spPercent = player.stamina / player.maxStamina;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, spBarHeight);
    ctx.fillStyle = "dodgerblue";
    ctx.fillRect(barX, curY, barWidth * spPercent, spBarHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, curY, barWidth, spBarHeight);
    curY += spBarHeight + 6;
    if (player.classChosen && player.playerClass) {
        ctx.fillStyle = "#ccc";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Class: " + player.playerClass.className + "  |  Q: " + player.playerClass.specialAbility, barX, curY + 10);
        curY += 18;
        drawAbilityCooldownRing(ctx, barX + barWidth - 14, curY + 14, 28, player);
        curY += 36;
    }
    ctx.fillStyle = "#aaa";
    ctx.font = "11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("M: " + player.mind + "  B: " + player.body + "  S: " + player.soul, barX, curY + 10);
}
function drawAbilityCooldownRing(ctx, cx, cy, radius, player) {
    if (!player.playerClass)
        return;
    const remaining = player.playerClass.getCooldownRemaining();
    const total = player.playerClass.abilityCooldown;
    const ready = remaining <= 0;
    ctx.beginPath();
    ctx.arc(cx, cy, radius / 2, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();
    if (!ready) {
        const progress = 1 - remaining / total;
        ctx.beginPath();
        ctx.arc(cx, cy, radius / 2, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
        ctx.strokeStyle = "dodgerblue";
        ctx.lineWidth = 3;
        ctx.stroke();
    }
    ctx.fillStyle = ready ? "limegreen" : "white";
    ctx.font = ready ? "8px monospace" : "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(ready ? "Ready" : "Q", cx, cy + 4);
}
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}
export function drawControlsPanel(ctx, canvas) {
    if (!canvas)
        return;
    const x = 16;
    const y = 16;
    const width = 160;
    const rows = [
        { key: "[WASD]", desc: "Move" },
        { key: "[SHIFT]", desc: "Sprint" },
        { key: "[R]", desc: "Attack" },
        { key: "[Q]", desc: "Ability" },
        { key: "[E]", desc: "Inventory" },
        { key: "[ESC]", desc: "Pause" },
        { key: "[1–4]", desc: "Class (Lvl 5+)" }
    ];
    const padTop = 14;
    const padBot = 14;
    const titleHeight = 11;
    const gapAfterTitle = 14;
    const rowHeight = 13;
    const rowGap = 12;
    const height = padTop + titleHeight + gapAfterTitle + (rows.length * rowHeight) + ((rows.length - 1) * rowGap) + padBot;
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    roundRect(ctx, x, y, width, height, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = "#aaaaaa";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("CONTROLS", x + 12, y + padTop + titleHeight);
    let drawY = y + padTop + titleHeight + gapAfterTitle;
    ctx.font = "13px monospace";
    for (const row of rows) {
        ctx.fillStyle = "#f0c040";
        ctx.textAlign = "left";
        ctx.fillText(row.key, x + 12, drawY + 10);
        ctx.fillStyle = "#cccccc";
        ctx.fillText(row.desc, x + 12 + 60, drawY + 10);
        drawY += rowHeight + rowGap;
    }
}
//# sourceMappingURL=HUD.js.map