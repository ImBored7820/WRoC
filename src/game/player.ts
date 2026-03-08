/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: This is the file for the player object, it creates the player
 * and monitors for pressed keys to then move the player with the associated
 * keys (WASD & Arrow keys)
 */

export class Player {
    x: number = 300; // These coordinates center the player in the room
    y: number = 300;
    speed: number = 8; // How fast it seems the player is moving
    private sprite: HTMLImageElement = new Image();
    private keys: Set<string> = new Set(); // Set of

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
        if (this.keys.has("w")) this.y -= this.speed;
        if (this.keys.has("W")) this.y -= this.speed + 3;
        if (this.keys.has("ArrowUp")) this.y -= this.speed;

        if (this.keys.has("s")) this.y += this.speed;
        if (this.keys.has("S")) this.y += this.speed + 3;
        if (this.keys.has("ArrowDown")) this.y += this.speed;

        if (this.keys.has("a")) this.x -= this.speed;
        if (this.keys.has("A")) this.x -= this.speed + 3;
        if (this.keys.has("ArrowLeft")) this.x -= this.speed;

        if (this.keys.has("d")) this.x += this.speed;
        if (this.keys.has("D")) this.x += this.speed + 3;
        if (this.keys.has("ArrowRight")) this.x += this.speed;
    }
    // Draws the temporary sprite onto the canvas at the center
    draw(ctx: CanvasRenderingContext2D) {
        this.sprite.src = "./assets/sprite.png";
        ctx.drawImage(this.sprite, this.x, this.y, 75, 75);
    }
}


