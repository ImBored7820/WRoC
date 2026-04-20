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

    public constructor(mobX: number, mobY: number, level: number) {
        // Mobs have an X and Y position, and a level
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
        this.mobSize = 25;
        // Level sets mob attack and defense value
        this.attackPower = level * 5;
        this.mobHealth = level * 10;
    }

    // Mob Attack Method
    attack(player: Player){
        // Player loses health when attacked
        player.health -= this.attackPower;
    }

    // Mob Health Loss Method
    loseHp(player: Player){
        // Mob loses health when player attacks
        let playerAP = player.body * 5;
        this.mobHealth -= playerAP;
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
            if (playerRelativeX > 0) moveX(36);
            if (playerRelativeX < 0) moveX(-36);
            if (playerRelativeY > 0) moveY(36);
            if (playerRelativeY < 0) moveY(-36);
        }

        // While mot close to player randomly moves
        if(!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 36;
            const randomY = (Math.floor(Math.random() * 3 )- 1) * 36;
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