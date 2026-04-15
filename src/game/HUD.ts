/**
 * Author: musa -
 * Date: 04/14/2026
 * Time: 21:34:38
 *
 * Description: Describe what the file does
 * Info: WRoC | HUD.ts | WebStorm
 */

import {player} from "../main.js";
import {canvas} from "../main.js";

// Draws the class selection overlay onto the screen
export function drawClassSelect(ctx: CanvasRenderingContext2D) {
    // Darken the screen
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Title text
    ctx.fillStyle = "white";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Level 5 Achieved Choose your class:", canvas.width / 2, canvas.height / 2 - 100);

    // Class options
    ctx.font = "12px monospace";
    ctx.fillText("1 - Language  (Soul focused, Ability: Persuade)", canvas.width / 2, canvas.height / 2 - 30);
    ctx.fillText("2 - STEM      (Mind focused, Ability: Construct)", canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText("3 - Sports    (Body focused, Ability: Bash)", canvas.width / 2, canvas.height / 2 + 50);
    ctx.fillText("4 - None      (Extra stat point)", canvas.width / 2, canvas.height / 2 + 90);
}

// Draws the HUD in the top right corner of the screen
export function drawHUD(ctx: CanvasRenderingContext2D) {
    const barWidth = 200;
    const padding = 20;
    const barX = canvas.width - barWidth - padding; // Anchored to top right
    let curY = padding; // Tracks vertical position as we draw down

    // Player name and level
    ctx.fillStyle = "black";
    ctx.font = "bold 16px monospace";
    ctx.textAlign = "left";
    ctx.fillText(player.name, barX, curY + 14);
    ctx.textAlign = "right";
    ctx.fillText("Lvl " + player.level, barX + barWidth, curY + 14);
    curY += 22;

    // XP bar
    const xpBarHeight = 4;
    const xpPercent = player.xp / player.xpToNextLevel;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, xpBarHeight);
    ctx.fillStyle = "limegreen";
    ctx.fillRect(barX, curY, barWidth * xpPercent, xpBarHeight);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, curY, barWidth, xpBarHeight);
    curY += xpBarHeight + 6;

    // Health bar
    const hpBarHeight = 12;
    const hpPercent = player.health / player.maxHealth;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, hpBarHeight);
    ctx.fillStyle = "crimson";
    ctx.fillRect(barX, curY, barWidth * hpPercent, hpBarHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, curY, barWidth, hpBarHeight);

    // Health text
    ctx.fillStyle = "white";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(player.health + " / " + player.maxHealth, barX + barWidth / 2, curY + 10);
    curY += hpBarHeight + 4;

    // Stamina bar
    const spBarHeight = 12;
    const spPercent = player.stamina / player.maxStamina;
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(barX, curY, barWidth, spBarHeight);
    ctx.fillStyle = "dodgerblue";
    ctx.fillRect(barX, curY, barWidth * spPercent, spBarHeight);
    ctx.strokeStyle = "white";
    ctx.strokeRect(barX, curY, barWidth, spBarHeight);

    // Stamina text
    ctx.fillStyle = "white";
    ctx.font = "10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(player.stamina + " / " + player.maxStamina, barX + barWidth / 2, curY + 10);
    curY += spBarHeight + 4;

    // Class display if chosen, shown under the bars
    if(player.classChosen && player.playerClass) {
        ctx.fillStyle = "black";
        ctx.font = "12px monospace";
        ctx.textAlign = "left";
        ctx.fillText("Class: " + player.playerClass.className + " (" + player.playerClass.specialAbility + ")", barX, curY + 12);
    }
}