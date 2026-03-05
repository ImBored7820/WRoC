/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: This file is meant to be a management file for the other game
 * items such as the map and player files, it draws and initializes the other
 * elements from their respective object files
 */

// Import the other ts files so that they can be referenced
// You will notice that they are .js and that is so that once build by TSC the
// produced js file actually uses js files instead of trying to use ts ones
import {drawMap} from "./game/map.js";
import {Player} from "./game/player.js";

/**
 * This is the function that basically does everything, it loads the sprites,
 * the map sets canvas attributes etc.
 */
function onStart() {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    const pixelMap = document.createElement("canvas");
    const mapCtx = pixelMap.getContext("2d");

    /* Tests */ const map = new Image(); map.src = "bg.png"; /* Tests */

    const player = new Player();
    player.movementKeys();

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pixelMap.width = canvas.width;
        pixelMap.height = canvas.height;
        if (mapCtx) drawMap(mapCtx);
    }

    window.addEventListener("resize", resize);
    resize();

    function refreshRate(){
        if (!ctx) return; // Safety check

        const camX = -player.x + canvas.width / 2;
        const camY = -player.y + canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(camX, camY);

        ctx.drawImage(pixelMap, 0, 0);

        player.update();
        player.draw(ctx);

        ctx.restore();

        window.requestAnimationFrame(refreshRate);
    }
    window.requestAnimationFrame(refreshRate);
}

window.addEventListener("DOMContentLoaded", onStart);

