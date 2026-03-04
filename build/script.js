// Import all other ts files ig
import { drawMap } from "./game/map.js";
import { Player } from "./game/player.js"; // TODO Finish Player class and add it here
function onStart() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    const mapCtx = mapCanvas.getContext("2d");
    drawMap(mapCtx);
    const player = new Player();
    player.movementKeys();
    function refreshRate() {
        // @ts-ignore
        ctx.drawImage(mapCanvas, 0, 0);
        player.update();
        if (ctx) {
            player.draw(ctx);
        }
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
