import { drawMap } from "./game/room.js";
import { Player } from "./game/player.js";
import { Mob } from "./game/mob.js";
import { drawHUD } from "./game/HUD.js";
import { drawClassSelect } from "./game/HUD.js";
export const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const map = document.createElement("canvas");
const mapCtx = map.getContext("2d");
export const player = new Player(200, 200);
export const mobArray = [];
function onStart() {
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
        let counter = 0;
        let isFirstTime = false;
        for (let i = 0; i < mobArray.length; i++) {
            if (mobArray[i].isMobDead == true) {
                mobArray.pop();
                counter++;
            }
            else if (mobArray.length < 2 || isFirstTime == true) {
                mobArray[i].draw(ctx);
                mobArray[i].mobMovement(player);
                console.log(mobArray[i].isMobDead);
                isFirstTime = true;
            }
        }
        while (counter != 0) {
            let mobX = counter * 50;
            let mobY = counter * 50;
            mobArray.push(new Mob(mobX, mobY, 2));
            counter--;
        }
        if (counter == 0) {
            mobArray.push(new Mob(368, 368, 2));
        }
        const playerRelativeX = player.x - mobArray[0].mobX;
        const playerRelativeY = player.y - mobArray[0].mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);
        const mobAttacksPlayer = (attackingMob) => {
            if (distance < 72)
                player.loseHP(attackingMob);
        };
        const playerAttacksMob = (attackingPlayer) => {
            if (attackingPlayer["keys"]?.has("r")) {
                if (distance < 72) {
                    mobArray[0].loseHP(attackingPlayer);
                }
            }
        };
        if (player.isPlayerDead) {
            if (player.isPlayerDead) {
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
                ctx.fillText("Game Over", canvas.width / 4 - 100, canvas.height / 4);
                ctx.fillText("Press Ctrl R to restart", canvas.width / 4 - 100, canvas.height / 4 + 50);
                return;
            }
        }
        mobAttacksPlayer(mobArray[0]);
        playerAttacksMob(player);
        ctx.restore();
        drawHUD(ctx);
        if (player.classSelect) {
            drawClassSelect(ctx);
        }
        numFrames += 1;
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
//# sourceMappingURL=main.js.map