import { drawMap } from "./game/map.js";
import { Player } from "./game/player.js";
function onStart() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const map = document.createElement("canvas");
    const mapCtx = map.getContext("2d");
    const player = new Player(200, 200);
    player.movementKeys();
    let chosenName = prompt("Enter your player name:");
    player.name = chosenName ? chosenName : "Player";
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        map.width = canvas.width;
        map.height = canvas.height;
        drawMap(mapCtx);
    }
    window.addEventListener("resize", resize);
    resize();
    window.addEventListener("keydown", e => {
        if (player.classSelect) {
            if (e.key === "1")
                player.selectClass("Language");
            else if (e.key === "2")
                player.selectClass("STEM");
            else if (e.key === "3")
                player.selectClass("Sports");
            else if (e.key === "4")
                player.selectClass("None");
        }
        if (e.key === "e" || e.key === "E") {
            player.increaseXP(1000);
        }
    });
    function drawClassSelect(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 16px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Level 5 Achieved Choose your class:", canvas.width / 2, canvas.height / 2 - 100);
        ctx.font = "12px monospace";
        ctx.fillText("1 - Language  (Soul focused, Ability: Persuade)", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText("2 - STEM      (Mind focused, Ability: Construct)", canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText("3 - Sports    (Body focused, Ability: Bash)", canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText("4 - None      (Extra stat point)", canvas.width / 2, canvas.height / 2 + 90);
    }
    function drawHUD(ctx) {
        const barWidth = 200;
        const padding = 20;
        const barX = canvas.width - barWidth - padding;
        let curY = padding;
        ctx.fillStyle = "black";
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
        const hpBarHeight = 12;
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
        ctx.fillText(player.health + " / " + player.maxHealth, barX + barWidth / 2, curY + 10);
        curY += hpBarHeight + 4;
        const spBarHeight = 12;
        const spPercent = player.stamina / player.maxStamina;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(barX, curY, barWidth, spBarHeight);
        ctx.fillStyle = "dodgerblue";
        ctx.fillRect(barX, curY, barWidth * spPercent, spBarHeight);
        ctx.strokeStyle = "white";
        ctx.strokeRect(barX, curY, barWidth, spBarHeight);
        ctx.fillStyle = "white";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText(player.stamina + " / " + player.maxStamina, barX + barWidth / 2, curY + 10);
        curY += spBarHeight + 4;
        if (player.classChosen && player.playerClass) {
            ctx.fillStyle = "black";
            ctx.font = "12px monospace";
            ctx.textAlign = "left";
            ctx.fillText("Class: " + player.playerClass.className + " (" + player.playerClass.specialAbility + ")", barX, curY + 12);
        }
    }
    function refreshRate() {
        const camX = (canvas.width / 2) - player.x;
        const camY = (canvas.height / 2) - player.y;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY);
        ctx.drawImage(map, 0, 0);
        player.update();
        player.draw(ctx);
        ctx.restore();
        drawHUD(ctx);
        if (player.classSelect) {
            drawClassSelect(ctx);
        }
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
//# sourceMappingURL=main.js.map