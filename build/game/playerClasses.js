import { Player } from "./player.js";
var ClassBaseStats;
(function (ClassBaseStats) {
    ClassBaseStats[ClassBaseStats["Language"] = 112] = "Language";
    ClassBaseStats[ClassBaseStats["STEM"] = 211] = "STEM";
    ClassBaseStats[ClassBaseStats["Sports"] = 121] = "Sports";
})(ClassBaseStats || (ClassBaseStats = {}));
export class playerClasses {
    specialAbility;
    playerLevel;
    constructor(userChoice, player, level) {
        if (level === 5) {
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
}
//# sourceMappingURL=playerClasses.js.map