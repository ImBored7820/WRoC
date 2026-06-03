import { drawTrisect } from "./game/map/drawTrisect.js";
import { Player } from "./game/player.js";
import { Mob } from "./game/mob.js";
import { drawHUD } from "./game/HUD.js";
import { drawClassSelect } from "./game/HUD.js";
import { unregisterAllRooms } from "./game/map/roomRegistry.js";
import { boss } from "./game/Boss.js";
export const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const map = document.createElement("canvas");
const mapCtx = map.getContext("2d");
export const player = new Player(1000, 720);
export const mobArray = [];
export const miniBoss = new boss(1000, 720, "miniBoss", "Josh");
let killCounter = 0;
function rectangularOverlapChecker(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}
function onStart() {
    player.movementKeys();
    miniBoss.bossMovement(player);
    let audio = new Audio('/bgmusic.aac');
    audio.loop = true;
    audio.volume = 1.0;
    let audioStarted = false;
    let chosenName = prompt("Enter your player name:");
    player.name = chosenName ? chosenName : "Player";
    audio.play().catch(error => {
        console.log('Audio playback failed:', error);
    });
    function resize() {
        unregisterAllRooms();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        map.width = 2160 * 3;
        map.height = 2160 * 3;
        drawTrisect(mapCtx, 0, 720 / 2);
        drawTrisect(mapCtx, 720 * 3 - 108, 720);
    }
    window.addEventListener("resize", resize);
    resize();
    window.addEventListener("keydown", numPressed => {
        if (!audioStarted) {
            audio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            audioStarted = true;
        }
        if (player.classSelect) {
            if (numPressed.key === "1")
                player.selectClass("Language");
            else if (numPressed.key === "2")
                player.selectClass("STEM");
            else if (numPressed.key === "3")
                player.selectClass("Sports");
            else if (numPressed.key === "4")
                player.selectClass("None");
        }
    });
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
        miniBoss.draw(ctx);
        ctx.fillStyle = "red";
        for (let i = mobArray.length - 1; i >= 0; i--) {
            if (mobArray[i].isMobDead == true) {
                mobArray.splice(i, 1);
                killCounter++;
                player.increaseXP(100);
            }
            else {
                mobArray[i].draw(ctx);
                mobArray[i].mobMovement(player);
                const isTouching = rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, mobArray[i].mobX, mobArray[i].mobY, mobArray[i].mobSize, mobArray[i].mobSize);
                if (isTouching) {
                    const timeNow = performance.now();
                    if (timeNow - mobArray[i].lastAttackTime >= mobArray[i].attackCooldown) {
                        player.loseHP(mobArray[i]);
                        mobArray[i].lastAttackTime = timeNow;
                    }
                }
                if (player.keys.has("r") && isTouching) {
                    mobArray[i].loseHP(player);
                }
            }
        }
        if (mobArray.length == 0) {
            mobArray.push(new Mob(player.x + 36, player.y + 36, 2, killCounter));
            mobArray.push(new Mob(player.x + 72, player.y + 72, 5, killCounter));
        }
        if (player.isPlayerDead) {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", player.x, player.y);
            ctx.fillText("Press Ctrl R to restart", player.x, player.y + 50);
        }
        ctx.restore();
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText("KillCount: " + killCounter, 100, 30);
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