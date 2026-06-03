/**
 * Author: musa -
 * Date: 06/03/2026
 * Time: 12:27:40
 *
 * Description: Describe what the file does
 * Info: WRoC | Boss.ts | WebStorm
 */
import type {Player} from "./player.js";
import {checkRectCollision} from "./collisionlogic.js";

const mobPattern= []

export class boss {
    x: number;
    y: number;
    type: string;
    name: string;
    isDead: boolean;

    health: number;
    attackPower: number;
    lastAttackTime: number;
    attackCooldown: number;

    bossSize: number;

    constructor(x: number, y: number, type: string, name: string) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.name = name;
        this.isDead = false;
        this.bossSize = 144;
        this.health = 5;
    }

    // Lose HP
    loseHP(player: Player) {
        // Mob loses health when player attacks
        let playerAP = player.body * 3;
        this.health -= playerAP;
        if (this.health <= 0) {
            this.isDead = true;
            this.health = 0;
        }
    }

    // Special Attack
    specialAttack(player: Player) {
        player.health = player.health * 0.5;
    }

    // Boss Movement
    bossMovement(player: Player) {
        // If the player is within 4 Tiles, mob heads towards player
        // Once player is "touched" enters attack mode

        // Check if player is within 4 tiles
        // d = sqrt[(x1-x2)^2+(y1-y2)^2]

        let isPlayerClose: boolean = false;
        const playerRelativeX = player.x - this.x;
        const playerRelativeY = player.y - this.y;
        const distance = Math.sqrt(playerRelativeX * playerRelativeX + playerRelativeY * playerRelativeY);

        const moveBossX = (dx: number) => {
            const newX = this.x + dx;
            if(!checkRectCollision(newX, this.y, this.bossSize, this.bossSize)) {
                this.x = newX;
            }
        }

        const moveBossY = (dy: number) => {
            const newY = this.y + dy;
            if(!checkRectCollision(this.x, newY, this.bossSize, this.bossSize)) {
                this.y = newY;
            }
        }

        if(distance <= 720) {
            isPlayerClose = true;
            if (playerRelativeX > 0) moveBossX(8);
            if (playerRelativeX < 0) moveBossX(-8);
            if (playerRelativeY > 0) moveBossY(8);
            if (playerRelativeY < 0) moveBossY(-8);
        }

        // While mot close to player randomly moves
        if(!isPlayerClose) {
            const randomX = (Math.floor(Math.random() * 3) - 1) * 2;
            const randomY = (Math.floor(Math.random() * 3)- 1) * 2;
            if (randomX !== 0)
                moveBossX(randomX);

            if (randomY !== 0)
                moveBossY(randomY);
        }

    }

    // draw
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillRect(this.x, this.y, this.bossSize, this.bossSize);
        ctx.font = "24px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText("Iter: " + this.name.toString() + " Health: " + this.health, this.x + this.bossSize / 2, this.y - 8);
    }
}