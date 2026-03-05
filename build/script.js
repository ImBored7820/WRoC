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
import { drawMap } from "./game/map.js";
import { Player } from "./game/player.js";
/**
 * This is the function that basically does everything, it loads the sprites,
 * the map sets canvas attributes etc.
 */
function onStart() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const pixelMap = document.createElement("canvas"); // map from map.ts
    const mapCtx = pixelMap.getContext("2d");
    /* Tests */ const map = new Image();
    map.src = "./assets/bg.png"; /* Tests */
    const player = new Player(); // Creates a new player then enables checking
    player.movementKeys(); // if movement keys are pressed
    // So the purpose of this function is to make a canvas that fits the screen
    // no matter what the screen size is
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pixelMap.width = canvas.width;
        pixelMap.height = canvas.height;
        drawMap(mapCtx);
    }
    window.addEventListener("resize", resize); // Watches for resizing of browser
    resize(); // This is for the first time, on load it "resizes" the canvas"
    function refreshRate() {
        if (!ctx)
            return; // Safety check, TypeScript thing
        player.update();
        // Logic for the "camera", moves the map instead of the player, creating
        // a visual effect of a camera following the player around
        const camX = (canvas.width / 2) - player.x;
        const camY = (canvas.height / 2) - player.y;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY); // Implements the previous map moving logic
        // into the canvas
        ctx.drawImage(pixelMap, 0, 0);
        player.update();
        player.draw(ctx);
        ctx.restore();
        window.requestAnimationFrame(refreshRate); // Recursion so changes
        // happen in real time
    }
    window.requestAnimationFrame(refreshRate);
}
window.addEventListener("DOMContentLoaded", onStart); // Once html is parsed,
// loads objects
