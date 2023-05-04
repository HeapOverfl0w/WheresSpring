import { Interactor } from "./interactor";

export class Npc extends Interactor {
    constructor(name, dialogText, dialogImage, itemRequirements, level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined, movementPoints = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation, movementPoints);
        this.name = name;
        this.dialogImage = dialogImage;
        this.dialogText = dialogText;
        this.itemRequirements = itemRequirements;
    }

    isCloseTo(x, y) {
        if (super.isCloseTo(x, y)) {
            return this.name;
        }
    }

    playerHasItemRequirements(player) {
        if (!this.itemRequirements) {
            return false;
        }

        let returnValue = true;
        for (let i = 0; i < this.itemRequirements.itemNames.length; i++) {
            let containsItem = false;
            for (let p = 0; p < player.inventory.length; p++) {
                if (this.itemRequirements.itemNames[i] === player.inventory[p].name) {
                    containsItem = true;
                    break;
                }

                if (!containsItem) {
                    returnValue = false;
                    break;
                }
            }
        }

        return returnValue;
    }

    interact(level, player) {
        if (playerHasItemRequirements(player)) {
            for (let i = 0; i < this.itemRequirements.itemNames.length; i++) {
                for (let p = player.inventory.length - 1; p > -1; p--) {
                    if (this.itemRequirements.itemNames[i] === player.inventory[p].name) {
                        player.inventory.splice(p, 1);
                        break;
                    }
                }
            }

            if (this.itemRequirements.returnItem) {
                player.inventory.push(this.itemRequirements.returnItem);
            }

            if (this.itemRequirements.changeAnimation) {
                this.idleAnimation = this.itemRequirements.changeAnimation;
                this.startIdleAnimation();
            }
        }

        return this.dialogText; 
    }
}