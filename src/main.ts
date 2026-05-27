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
import {drawTrisect} from "./game/map/drawTrisect.js";
import {Player} from "./game/player.js";
//import {playerColors} from "./game/player.js";
import {Mob} from "./game/mob.js";
import {drawHUD} from "./game/HUD.js";
import {drawClassSelect} from "./game/HUD.js";
import {unregisterAllRooms} from "./game/map/roomRegistry.js";

export const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const map = document.createElement("canvas"); // map from patterns.ts
const mapCtx = map.getContext("2d"); // Gets drawn into memory for faster
// loading times
export const player = new Player(1000, 720); // Creates a new player then enables checking
//export const mob = new Mob(368,368, 2);
export const mobArray: Mob[] = [];
let killCounter = 0;

function rectangularOverlapChecker (ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function onStart() {

    player.movementKeys(); // if movement keys are pressed

    // Prompt the player to choose a name on load
    let chosenName = prompt("Enter your player name:");
    player.name = chosenName ? chosenName : "Player";

    // So the purpose of this function is to make a canvas that fits the screen
    // no matter what the screen size is
    function resize() {
        unregisterAllRooms();
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        map.width = 2160*3;
        map.height = 2160*3;
        drawTrisect(mapCtx, 0,720/2);
        drawTrisect(mapCtx, 720*3-108,0);
    }

    window.addEventListener("resize", resize); // Watches for resizing of browser
    resize(); // This is for the first time, on load it "resizes" the canvas"

    // Listens for class selection keys (1-4) when the class select screen is showing
    window.addEventListener("keydown", numPressed => {
        if(player.classSelect) {
            if(numPressed.key === "1") player.selectClass("Language");
            else if(numPressed.key === "2") player.selectClass("STEM");
            else if(numPressed.key === "3") player.selectClass("Sports");
            else if(numPressed.key === "4") player.selectClass("None");
        }
    });

    //const start = performance.now();
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

        for(let i = mobArray.length - 1; i >= 0; i--){
            if(mobArray[i].isMobDead == true){
                mobArray.splice(i, 1);
                killCounter++;
                player.increaseXP(100);
            } else {
                mobArray[i].draw(ctx);
                mobArray[i].mobMovement(player);
                const isTouching = rectangularOverlapChecker(player.x, player.y, player.playerSize, player.playerSize, mobArray[i].mobX, mobArray[i].mobY, mobArray[i].mobSize, mobArray[i].mobSize)
                if(isTouching) {
                    const timeNow = performance.now();
                    if (timeNow - mobArray[i].lastAttackTime >= mobArray[i].attackCooldown) {
                        player.loseHP(mobArray[i]);
                        mobArray[i].lastAttackTime = timeNow;
                    }
                }

                if(player.keys.has("r") && isTouching) {
                    mobArray[i].loseHP(player);
                }
            }
        }

        if(mobArray.length == 0){
            mobArray.push(new Mob(player.x + 36,player.y + 36,2, killCounter));
            //mobArray.push(new Mob(368,368,2, killCounter+1));
        }
        if (player.isPlayerDead) {
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
            ctx.fillText("Game Over", canvas.width / 4 - 100, canvas.height / 4);
            ctx.fillText("Press Ctrl R to restart", canvas.width / 4 - 100, canvas.height / 4 + 50);
        }


        ctx.restore();
        ctx.fillStyle = "yellow";
        ctx.font = "20px Arial";
        ctx.fillText("KillCount: " + killCounter, 100, 30);

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
