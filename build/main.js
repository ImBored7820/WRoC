import { drawMap } from "./game/map.js";
import { Player } from "./game/player.js";
function onStart() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const map = document.createElement("canvas");
    const mapCtx = map.getContext("2d");
    const player = new Player(210, 210);
    player.movementKeys();
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
        if (player.showClassSelect) {
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
            player.gainXP(50);
        }
    });
    function drawClassSelect(ctx) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "bold 32px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Level 5! Choose your class:", canvas.width / 2, canvas.height / 2 - 100);
        ctx.font = "24px monospace";
        ctx.fillText("1 - Language  (Soul focused, Ability: Persuade)", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText("2 - STEM      (Mind focused, Ability: Construct)", canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText("3 - Sports    (Body focused, Ability: Bash)", canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText("4 - None      (Extra stat point)", canvas.width / 2, canvas.height / 2 + 90);
    }
    function drawHUD(ctx) {
        const barWidth = 200;
        const barHeight = 16;
        const barX = 10;
        const barY = 10;
        const xpPercent = player.xp / player.xpToNextLevel;
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = "limegreen";
        ctx.fillRect(barX, barY, barWidth * xpPercent, barHeight);
        ctx.strokeStyle = "white";
        ctx.strokeRect(barX, barY, barWidth, barHeight);
        ctx.fillStyle = "white";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Lvl " + player.level + "  XP: " + player.xp + "/" + player.xpToNextLevel, barX, barY + barHeight + 16);
        if (player.classChosen && player.playerClass) {
            ctx.fillText("Class: " + player.playerClass.className + " (" + player.playerClass.specialAbility + ")", barX, barY + barHeight + 34);
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
        if (player.showClassSelect) {
            drawClassSelect(ctx);
        }
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
//# sourceMappingURL=main.js.map