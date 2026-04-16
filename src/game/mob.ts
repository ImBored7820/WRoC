/**
 * Author: 2030971 -
 * Date: 04/14/2026
 * Time: 13:47:09
 *
 * Description: Describe what the file does
 * Info: WRoC | mob.ts | WebStorm
 */
import type {Player} from "./player";

export class Mob {
    // Mob Class Constructor
    mobX: number;
    mobY: number;
    level: number;

    attackPower: number;
    mobHealth: number;

    public constructor(mobX: number, mobY: number, level: number) {
        // Mobs have an X and Y position, and a level
        this.mobX = mobX;
        this.mobY = mobY;
        this.level = level;
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

        if(distance <= 108) {
            isPlayerClose = true;
            if (playerRelativeX > 0) this.mobX += 36;
            if (playerRelativeX < 0) this.mobX -= 36;
            if (playerRelativeY > 0) this.mobY += 36;
            if (playerRelativeY < 0) this.mobY -= 36;
        }

        // While mot close to player randomaly moves
        if(!isPlayerClose) {
            const randomX = Math.random() * 36;
            const randomY = Math.random() * 36;
            this.mobX += randomX;
            this.mobY += randomY;
        }

    }
    // Draw Mob Method
    draw(ctx: CanvasRenderingContext2D) {
        //ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
        ctx.fillRect(this.mobX, this.mobY, 20, 20);
    }
}