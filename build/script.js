// Import all other ts files
import { drawMap } from "./game/map.js";
function onStart() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    const mapCtx = mapCanvas.getContext("2d");
    drawMap(mapCtx);
    function refreshRate() {
        // @ts-ignore
        ctx.drawImage(mapCanvas, 0, 0);
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart);
