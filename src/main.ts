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
import {drawMap} from "./game/room.js";
import {Player} from "./game/player.js";
import {Mob} from "./game/mob.js";
import {drawHUD} from "./game/HUD.js";
import {drawClassSelect} from "./game/HUD.js";

/**
 * This is the function that basically does everything, it loads the sprites,
 * the map sets canvas attributes etc.
 */

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const map = document.createElement("canvas"); // map from room.ts
const mapCtx = map.getContext("2d"); // Gets drawn into memory for faster
// loading times
export const player = new Player(200, 200); // Creates a new player then enables checking
//export const mob = new Mob(368,368, 2);
export const mobArray: Mob[] = [];

function onStart() {

    player.movementKeys(); // if movement keys are pressed

    // Prompt the player to choose a name on load
    let chosenName = prompt("Enter your player name:");
    player.name = chosenName ? chosenName : "Player";

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
        if(player.classSelect) {
            if(e.key === "1") player.selectClass("Language");
            else if(e.key === "2") player.selectClass("STEM");
            else if(e.key === "3") player.selectClass("Sports");
            else if(e.key === "4") player.selectClass("None");
        }
        // Temporary XP gain for testing
        // TODO Remove once mobs are implemented
        if(e.key === "e" || e.key === "E") {
            player.increaseXP(1000);
        }
    });

    const start = performance.now();
    let numFrames = 0;
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
        ctx.fillStyle = "red";
        let counter = 0;
        let isFirstTime = false;
        for(let i = 0; i < mobArray.length; i++){
            if(mobArray[i].isMobDead == true){
                mobArray.pop();
                counter++;
            } else if(mobArray.length < 2 || isFirstTime == true) {
                mobArray[i].draw(ctx);
                mobArray[i].mobMovement(player);
                console.log(mobArray[i].isMobDead);
                isFirstTime = true;
            }
        }

        while(counter != 0){
            let mobX = counter * 50;
            let mobY = counter * 50;
            mobArray.push(new Mob(mobX,mobY,2));
            counter--;
        }

        if(counter == 0){
            mobArray.push(new Mob(368,368,2));
        }

        const playerRelativeX = player.x - mobArray[0].mobX;
        const playerRelativeY = player.y - mobArray[0].mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        const mobAttacksPlayer = (attackingMob: Mob) => {
            if (distance < 72)
                player.loseHP(attackingMob);

        }

        const playerAttacksMob = (attackingPlayer: Player) => {
            if(attackingPlayer["keys"]?.has("r")) {
                if(distance < 72)
                {
                    mobArray[0].loseHP(attackingPlayer);
                }
            }
        }

        if (player.isPlayerDead) {
            if(player.isPlayerDead) {
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

        // HUD is drawn in screen space (after restore) so it stays fixed on screen
        drawHUD(ctx);

        // Class selection overlay drawn on top of everything
        if(player.classSelect) {
            drawClassSelect(ctx);
        }

        numFrames += 1;
        //console.log(numFrames / ((performance.now() - start) / 1000))
        //setTimeout(refreshRate);
        window.requestAnimationFrame(refreshRate); // Recursion so changes
                                                   // happen in real time
    }
    window.requestAnimationFrame(refreshRate);
}

window.addEventListener("DOMContentLoaded", onStart); // Once HTML is parsed,
                                                            // loads objects
