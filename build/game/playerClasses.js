import { Player } from "./player.js";
var ClassBaseStats;
(function (ClassBaseStats) {
    ClassBaseStats[ClassBaseStats["Language"] = 112] = "Language";
    ClassBaseStats[ClassBaseStats["STEM"] = 211] = "STEM";
    ClassBaseStats[ClassBaseStats["Sports"] = 121] = "Sports";
})(ClassBaseStats || (ClassBaseStats = {}));
export class playerClasses {
    className;
    specialAbility;
    playerLevel;
    constructor(userChoice, player, level) {
        this.className = userChoice;
        if (level >= 5) {
            if (userChoice == "Language") {
                player.soul = ClassBaseStats.Language;
                this.specialAbility = "Persuade";
            }
            else if (userChoice == "STEM") {
                player.mind = ClassBaseStats.STEM;
                this.specialAbility = "Construct";
            }
            else if (userChoice == "Sports") {
                player.body = ClassBaseStats.Sports;
                this.specialAbility = "Bash";
            }
            else {
                player.extraStatPoints = 1;
                this.specialAbility = "none";
            }
        }
        this.playerLevel = level;
    }
    specialAttack(ability) {
        let damage = 0;
        let radius = 0;
        if (ability == "Persuade") {
            damage = 2;
            radius = 5;
        }
        else if (ability == "Construct") {
            damage = 3;
            radius = 1;
        }
        else if (ability == "Bash") {
            damage = 4;
            radius = 2;
        }
        else {
            damage = 1;
            radius = 1;
        }
    }
}
//# sourceMappingURL=playerClasses.js.map