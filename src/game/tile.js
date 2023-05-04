export class Tile {
    constructor(name, animation, passable, levelObject = undefined) {
        this.name = name;
        this.activeAnimation = animation;
        this.passable = passable;
        this.levelObject = levelObject;
        this.lightCoefficient = 1;
    }

    copy() {
        const returnValue = new Tile(this.name, this.activeAnimation, this.passable, this.levelObject?.copy());
        if (this.lightCoefficient !== undefined) {
            returnValue.lightCoefficient = this.lightCoefficient;
        } else {
            returnValue.lightCoefficient = 1;
        }
        
        return returnValue;
    }
}