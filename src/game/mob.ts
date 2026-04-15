/**
 * Author: 2030971 -
 * Date: 04/14/2026
 * Time: 13:47:09
 *
 * Description: Describe what the file does
 * Info: WRoC | mob.ts | WebStorm
 */
import type {Player} from "./player";

class Mob {
    // Mob Class Constructor
    x: number;
    y: number;
    level: number;

    attackPower: number;
    mobHealth: number;

    public constructor(mobX: number, mobY: number, level: number) {
        // Mobs have an X and Y position, and a level
        this.x = mobX;
        this.y = mobY;
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
        // Mob randomly roams

        // If the player is within 4 Tiles, mob heads towards player
        // Once player is "touched" enters attack mode

        // Check if player is within 4 tiles
        // d = sqrt[(x1-x2)^2+(y1-y2)^2]
        let isPlayerClose: boolean;

        let relativePlayerX: number;
        let relativePlayerY: number;
        let relativePlayerDistance: number;
        relativePlayerX = player.x - this.mobX;
        relativePlayerX = relativePlayerX * relativePlayerX;
        relativePlayerY = player.y - this.mobY;
        relativePlayerY = relativePlayerY * relativePlayerY;

        relativePlayerDistance = relativePlayerX + relativePlayerY;
        relativePlayerDistance = Math.sqrt(relativePlayerDistance);

        if(player.x == this.mobX || player.y == this.mobY)
            isPlayerClose = true;
        else
            isPlayerClose = false;


    }
    // Draw Mob Method
    draw(ctx: CanvasRenderingContext2D) {
        //ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
        ctx.fillRect(this.x, this.y, 30, 30);
    }
}