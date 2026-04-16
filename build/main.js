import { drawMap } from "./game/map.js";
import { Player } from "./game/player.js";
import { Mob } from "./game/mob.js";
import { drawHUD } from "./game/HUD.js";
import { drawClassSelect } from "./game/HUD.js";
export const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const map = document.createElement("canvas");
const mapCtx = map.getContext("2d");
export const player = new Player(200, 200);
export const mob = new Mob(368, 368, 2);
function onStart() {
    player.movementKeys();
    mob.mobMovement(player);
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
    const start = performance.now();
    let numFrames = 0;
    function refreshRate() {
        const camX = (canvas.width / 2) - player.x;
        const camY = (canvas.height / 2) - player.y;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY);
        ctx.drawImage(map, 0, 0);
        player.update();
        player.draw(ctx);
        ctx.fillStyle = "red";
        mob.mobMovement(player);
        mob.draw(ctx);
        ctx.restore();
        drawHUD(ctx);
        if (player.classSelect) {
            drawClassSelect(ctx);
        }
        numFrames += 1;
        console.log(numFrames / ((performance.now() - start) / 1000));
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
//# sourceMappingURL=main.js.map