// Import all other ts files
import {drawMap} from "./game/map";
import {Player} from "./game/player"; // TODO Finish Player class and add it here

function onStart() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const mapCanvas = document.createElement("canvas");
    mapCanvas.width = canvas.width;
    mapCanvas.height = canvas.height;
    const mapCtx = mapCanvas.getContext("2d");

    drawMap(mapCtx);

    function refreshRate(){
        ctx.drawImage(mapCanvas, 0, 0);
        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}

window.addEventListener("DOMContentLoaded", onStart);

