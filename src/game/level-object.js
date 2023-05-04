export class LevelObject {
    constructor(name, animation, passable = true) {
        this.name = name;
        this.activeAnimation = animation;
        this.passable = passable;
    }

    copy() {
        return new LevelObject(this.name, this.activeAnimation, this.passable);
    }
}