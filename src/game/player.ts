/**
 * Author: Musa Ali
 * Date: 3/4/2026
 *
 * Description: This is the file for the player object, it creates the player
 * and monitors for pressed keys to then move the player with the associated
 * keys (WASD & Arrow keys)
 */
import {checkCollision} from "./map.js";
import {playerClasses} from "./playerClasses.js";

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

    name: string;
    level: number;

    xp: number;
    xpToNextLevel: number;

    health: number;
    maxHealth: number;
    stamina: number;
    maxStamina: number;

    mind: number;
    body: number;
    soul: number;
    extraStatPoints: number;

    classSelect: boolean;
    classChosen: boolean;
    playerClass: playerClasses | null;

    private sprite: HTMLImageElement = new Image();
    private keys: Set<string> = new Set(); // Set of

    public constructor(x: number, y: number, level?: number, MBS?: number) {
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
        this.extraStatPoints = 0;

        // Preload sprite once instead of setting src every draw call
        this.sprite.src = "./src/assets/sprite.png";
        this.playerSize = 65;

        // Player name, set later via prompt
        this.name = "Player";

        // Health and Stamina based on SubStats
        this.maxHealth = SubStats.Health;
        this.health = this.maxHealth;
        this.maxStamina = SubStats.Stamina;
        this.stamina = this.maxStamina;

        // XP system xp needed doubles every level (100 -> 200 -> 400 -> 800)
        this.xp = 0;
        if(level && level > 0)
            this.level = level;
        else
            this.level = 0;
        this.xpToNextLevel = 100 * Math.pow(2, this.level);

        // Class selection triggers at level 5
        this.classSelect = false;
        this.classChosen = false;
        this.playerClass = null;
    }

    movementKeys() {
        // These are monitoring for key presses, whatever key is pressed is
        // added to the keyset, when not pressed its removed
        // Keys are stored lowercase to prevent the shift+key stuck movement bug
        window.addEventListener("keydown", e => this.keys.add(e.key.toLowerCase()));
        window.addEventListener("keyup",   e => this.keys.delete(e.key.toLowerCase()));
    }

    /*
    So update is checking keys constantly to see if keys are in set, if they
    are, it means they are being pressed and so it performs the associated
    action with whatever key is pressed
    ex. w - up, shift + w - up but faster
    shift speed boost now works for both WASD and arrow keys

    TODO Fix bugs
     */
    update() {
        // Dont move if class selection screen is up
        if(this.classSelect) return;

        let dx = 0;
        let dy = 0;
        const shiftHeld = this.keys.has("shift");
        const speedBoost = shiftHeld ? this.body / 2 : 0;

        if (this.keys.has("w") || this.keys.has("arrowup")) dy -= SubStats.Speed + speedBoost;
        if (this.keys.has("s") || this.keys.has("arrowdown")) dy += SubStats.Speed + speedBoost;
        if (this.keys.has("a") || this.keys.has("arrowleft")) dx -= SubStats.Speed + speedBoost;
        if (this.keys.has("d") || this.keys.has("arrowright")) dx += SubStats.Speed + speedBoost;

        // Collision checks use 4 corners of the player hitbox offset by 15px
        const newX = this.x + dx;
        if (!checkCollision(newX, this.y) && !checkCollision(newX + this.playerSize, this.y) &&
            !checkCollision(newX, this.y + this.playerSize) &&
            !checkCollision(newX + this.playerSize, this.y + this.playerSize)) {
            this.x = newX;
        }

        const newY = this.y + dy;
        if (!checkCollision(this.x, newY) && !checkCollision(this.x + this.playerSize, newY) &&
            !checkCollision(this.x, newY + this.playerSize) &&
            !checkCollision(this.x + this.playerSize, newY + this.playerSize)) {
            this.y = newY;
        }
    }

    // Adds xp to the player and checks if they leveled up
    increaseXP(amount: number) {
        this.xp += amount;
        while(this.xp >= this.xpToNextLevel) {
            this.xp -= this.xpToNextLevel;
            this.level++;
            this.xpToNextLevel = 100 * Math.pow(2, this.level);

            // At level 5 prompt the user to select a class
            if(this.level >= 5 && !this.classChosen) {
                this.classSelect = true;
            }
        }
    }

    // Called when the user picks a class at level 5
    selectClass(choice: string) {
        this.playerClass = new playerClasses(choice, this, this.level);
        this.classChosen = true;
        this.classSelect = false;
    }

    // Draws the sprite onto the canvas
    draw(ctx: CanvasRenderingContext2D) {
        //ctx.drawImage(this.sprite, this.x, this.y, this.playerSize, this.playerSize);
        ctx.fillRect(this.x, this.y, this.playerSize, this.playerSize);
    }
}
