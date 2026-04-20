/**
 * Author: 2030971 -
 * Date: 04/14/2026
 * Time: 13:47:09
 *
 * Description: Describe what the file does
 * Info: WRoC | mob.ts | WebStorm
 */
import type {Player} from "./player.js";
import {checkCollision} from "./map.js";

export class Mob {
    // Mob Class Constructor
    mobX: number;
    mobY: number;
    level: number;
    mobSize: number;

    attackPower: number;
    mobHealth: number;

    isMobDead: boolean;

    public constructor(mobX: number, mobY: number, level: number) {
        // Mobs have an X and Y position, and a level
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 25;
        this.isMobDead = false;
        // Level sets mob attack and defense value
        this.attackPower = 1;
        this.mobHealth = 10;
    }

    // Mob Health Loss Method
    loseHP(player: Player) {
        // Mob loses health when player attacks
        let playerAP = player.body * 5;
        if (this.mobHealth > 0) {
            this.mobHealth -= playerAP;
        }
        else {
            this.isMobDead = true;
        }
    }
    // Mob Movement Method
    mobMovement(player: Player){
        // If the player is within 4 Tiles, mob heads towards player
        // Once player is "touched" enters attack mode

        // Check if player is within 4 tiles
        // d = sqrt[(x1-x2)^2+(y1-y2)^2]
        let isPlayerClose: boolean = false;
        const playerRelativeX = player.x - this.mobX;
        const playerRelativeY = player.y - this.mobY;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        const moveX = (dx: number) => {
            const newX = this.mobX + dx;
            if(!checkCollision(newX, this.mobY) &&
                !checkCollision(newX + this.mobSize, this.mobY) &&
                !checkCollision(newX, this.mobY + this.mobSize) &&
                !checkCollision(newX + this.mobSize, this.mobY + this.mobSize)) {

                this.mobX = newX;
            }
        }

        const moveY = (dy: number) => {
            const newY = this.mobY + dy;
            if(!checkCollision(this.mobX, newY) &&
            !checkCollision(this.mobX + this.mobSize, newY) &&
            !checkCollision(this.mobX, newY + this.mobSize) &&
            !checkCollision(this.mobX + this.mobSize, newY + this.mobSize)) {
                this.mobY = newY;
            }
        }

        if(distance <= 108) {
            isPlayerClose = true;
            if (playerRelativeX > 0) moveX(9);
            if (playerRelativeX < 0) moveX(-9);
            if (playerRelativeY > 0) moveY(9);
            if (playerRelativeY < 0) moveY(-9);
        }

        // While mot close to player randomly moves
        if(!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 9;
            const randomY = (Math.floor(Math.random() * 3 )- 1) * 9;
            if (randomX !== 0)
                moveX(randomX);

            if (randomY !== 0)
                moveY(randomY);
        }

    }
    // Draw Mob Method
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(this.mobX, this.mobY, this.mobSize, this.mobSize);
    }
}