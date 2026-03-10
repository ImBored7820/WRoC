/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: This is the file for the player object, it creates the player
 * and monitors for pressed keys to then move the player with the associated
 * keys (WASD & Arrow keys)
 */
import {checkCollision} from "./map.js";

// These are all influenced by body, and to an extent mind & soul
// They should not be changed, but a new player classes stats can enhance them
enum SubStats {
    Speed = 6, // How fast it seems the player is moving
    Health = 100,
    Stamina = 100,
}

export class Player {
    x: number;
    y: number;
    playerSize: number;
    mind: number;
    body: number;
    soul: number;
    private sprite: HTMLImageElement = new Image();
    private keys: Set<string> = new Set(); // Set of

    public constructor(x: number, y: number, MBS?: number) {
        this.x = x;
        this.y = y;

        if (MBS && MBS < 100)
            MBS = 111;
        else if(!MBS)
            MBS = 111;

        let  mbsToString = MBS.toString();
        let temp = mbsToString.split('').map(Number);
        this.mind = temp[0];
        this.body = temp[1];
        this.soul = temp[2];

        // Preload sprite once instead of setting src every draw call
        this.sprite.src = "./assets/sprite.png";
        this.playerSize = 60;
    }

    movementKeys() {
        // These are monitoring for key presses, whatever key is pressed is
        // added to the keyset, when not pressed its removed
        window.addEventListener("keydown", e => this.keys.add(e.key));
        window.addEventListener("keyup",   e => this.keys.delete(e.key));
    }

    /*
    So update is checking keys constantly to see if keys are in set, if they
    are, it means they are being pressed and so it performs the associated
    action with whatever key is pressed
    ex. w - up shift + w = W - up but faster
    *no speed boost for arrow keys yet

    TODO Make it so arrow keys also have speed boosts
    TODO Fix bug where clicking on a key then shift + key causes player to
     constantly move that direction
     */
    update() {
        let dx = 0;
        let dy = 0;

        if (this.keys.has("w")) dy -= SubStats.Speed;
        if (this.keys.has("W")) dy -= SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowUp")) dy -= SubStats.Speed;

        if (this.keys.has("s")) dy += SubStats.Speed;
        if (this.keys.has("S")) dy += SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowDown")) dy += SubStats.Speed;

        if (this.keys.has("a")) dx -= SubStats.Speed;
        if (this.keys.has("A")) dx -= SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowLeft")) dx -= SubStats.Speed;

        if (this.keys.has("d")) dx += SubStats.Speed;
        if (this.keys.has("D")) dx += SubStats.Speed + this.body / 2;
        if (this.keys.has("ArrowRight")) dx += SubStats.Speed;

        const newX = this.x + dx;
        if (!checkCollision(newX, this.y) &&
            !checkCollision(newX + this.playerSize - 1, this.y) &&
            !checkCollision(newX, this.y + this.playerSize - 1) &&
            !checkCollision(newX + this.playerSize - 1, this.y + this.playerSize - 1)) {
            this.x = newX;
        }

        const newY = this.y + dy;
        if (!checkCollision(this.x, newY) &&
            !checkCollision(this.x + this.playerSize - 1, newY) &&
            !checkCollision(this.x, newY + this.playerSize - 1) &&
            !checkCollision(this.x + this.playerSize, newY + this.playerSize)) {
            this.y = newY;
        }
    }

    // Draws the sprite onto the canvas
    draw(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
    }
}


