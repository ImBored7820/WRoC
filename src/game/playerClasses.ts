/**
 * Author: 2030971 -
 * Date: 03/23/2026
 * Time: 14:05:25
 *
 * Description: Describe what the file does
 * Info: WRoC | playerClasses.ts | WebStorm
 */

import {Player} from "./player.js"

// M-B-S
enum ClassBaseStats {
    Language = 112,
    STEM = 211,
    Sports = 121,
}
export class playerClasses {
    // TODO What attributes does a class need from a player
    className: string;
    specialAbility: string;
    playerLevel: number;
    constructor(userChoice: string, player: Player, level: number)
    {
        this.className = userChoice;
        if(level >= 5) {
            if (userChoice == "Language") {
                player.soul = ClassBaseStats.Language;
                this.specialAbility = "Persuade"
            } else if (userChoice == "STEM") {
                player.mind = ClassBaseStats.STEM;
                this.specialAbility = "Construct"
            } else if (userChoice == "Sports") {
                player.body = ClassBaseStats.Sports;
                this.specialAbility = "Bash"
            } else {
                player.extraStatPoints = 1;
                this.specialAbility = "none"
            }
        }
        this.playerLevel = level;
    }
    specialAttack(ability: string) {
        let damage = 0;
        let radius = 0;
        //let animation = drawAnimation(radius, ability);

        if(ability == "Persuade") {
            damage = 2;
            radius = 5;
        } else if(ability == "Construct") {
            damage = 3;
            radius = 1;
        } else if(ability == "Bash") {
            damage = 4;
            radius = 2;
        } else {
            damage = 1;
            radius = 1;
        }
    }

}

/*export function drawAnimation(radius: number, ability: string) {

}*/