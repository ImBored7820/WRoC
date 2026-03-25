/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: This file is meant to be a management file for the other game
 * items such as the map and player files, it draws and initializes the other
 * elements from their respective object files
 */

// Import the necessary methods from other ts files so that they can be referenced
// You will notice that they are .js, and that is so that once build by TSC the
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

    const map = document.createElement("canvas"); // map from map.ts
    const mapCtx = map.getContext("2d"); // Gets drawn into memory for faster
                                                                             // loading times
    const player = new Player(210, 210); // Creates a new player then enables checking
    player.movementKeys(); // if movement keys are pressed

    // So the purpose of this function is to make a canvas that fits the screen
    // no matter what the screen size is
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        map.width = canvas.width;
        map.height = canvas.height;
        drawMap(mapCtx);
    }

    window.addEventListener("resize", resize); // Watches for resizing of browser
    resize(); // This is for the first time, on load it "resizes" the canvas"

    // Listens for class selection keys (1-4) when the class select screen is showing
    window.addEventListener("keydown", e => {
        if(player.showClassSelect) {
            if(e.key === "1") player.selectClass("Language");
            else if(e.key === "2") player.selectClass("STEM");
            else if(e.key === "3") player.selectClass("Sports");
            else if(e.key === "4") player.selectClass("None");
        }
        // Temporary XP gain for testing (press E to gain 50xp)
        // TODO Remove once mobs are implemented
        if(e.key === "e" || e.key === "E") {
            player.gainXP(50);
        }
    });

    // Draws the class selection overlay onto the screen
    function drawClassSelect(ctx: CanvasRenderingContext2D) {
        // Darken the screen
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title text
        ctx.fillStyle = "white";
        ctx.font = "bold 32px monospace";
        ctx.textAlign = "center";
        ctx.fillText("Level 5! Choose your class:", canvas.width / 2, canvas.height / 2 - 100);

        // Class options
        ctx.font = "24px monospace";
        ctx.fillText("1 - Language  (Soul focused, Ability: Persuade)", canvas.width / 2, canvas.height / 2 - 30);
        ctx.fillText("2 - STEM      (Mind focused, Ability: Construct)", canvas.width / 2, canvas.height / 2 + 10);
        ctx.fillText("3 - Sports    (Body focused, Ability: Bash)", canvas.width / 2, canvas.height / 2 + 50);
        ctx.fillText("4 - None      (Extra stat point)", canvas.width / 2, canvas.height / 2 + 90);
    }

    // Draws the HUD (level, xp bar, class) in screen space
    function drawHUD(ctx: CanvasRenderingContext2D) {
        const barWidth = 200;
        const barHeight = 16;
        const barX = 10;
        const barY = 10;
        const xpPercent = player.xp / player.xpToNextLevel;

        // XP bar background
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // XP bar fill
        ctx.fillStyle = "limegreen";
        ctx.fillRect(barX, barY, barWidth * xpPercent, barHeight);

        // XP bar border
        ctx.strokeStyle = "white";
        ctx.strokeRect(barX, barY, barWidth, barHeight);

        // Level text
        ctx.fillStyle = "white";
        ctx.font = "14px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Lvl " + player.level + "  XP: " + player.xp + "/" + player.xpToNextLevel, barX, barY + barHeight + 16);

        // Class display if chosen
        if(player.classChosen && player.playerClass) {
            ctx.fillText("Class: " + player.playerClass.className + " (" + player.playerClass.specialAbility + ")", barX, barY + barHeight + 34);
        }
    }

    function refreshRate(){
        // Logic for the "camera", moves the map instead of the player, creating
        // a visual effect of a camera following the player around
        const camX = (canvas.width / 2) - player.x;
        const camY = (canvas.height / 2) - player.y;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(camX, camY); // Implements the previous map moving logic
                                   // into the canvas
        ctx.drawImage(map, 0, 0);

        player.update();
        player.draw(ctx);

        ctx.restore();

        // HUD is drawn in screen space (after restore) so it stays fixed on screen
        drawHUD(ctx);

        // Class selection overlay drawn on top of everything
        if(player.showClassSelect) {
            drawClassSelect(ctx);
        }

        window.requestAnimationFrame(refreshRate); // Recursion so changes
                                                   // happen in real time
    }
    window.requestAnimationFrame(refreshRate);
}

window.addEventListener("DOMContentLoaded", onStart); // Once HTML is parsed,
                                                            // loads objects
