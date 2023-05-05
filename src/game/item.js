import { Interactor } from "./interactor";

export class Item extends Interactor {
    constructor(name, desc, imageName, level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined, movementPoints = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation, movementPoints);
        this.name = name;
        this.desc = desc;
        this.imageName = imageName;
    }

    isCloseTo(x, y) {
        if (super.isCloseTo(x, y)) {
            return `Pick Up ${this.name}`;
        }
    }

    interact(level, player) {
        if (level.tiles[this.tileX][this.tileY].actor === this) {
            player.inventory.push(this);
            level.tiles[this.tileX][this.tileY].actor = undefined;
            this.stationary = true;
            this.aStarPath = [];
            this.x = 0;
            this.y = 0;
        }
    }
}