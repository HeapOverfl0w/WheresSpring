import { Actor } from "./actor";
import { GLOBAL_AUDIO_HANDLER } from "./audio-handler";
import { Item } from "./item";


export class Player extends Actor {
    constructor(camera, level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation);
        this.camera = camera;
        this.inventory = [
            new Item("Letter for Spring", 
            "A letter for a Ms. Spring, 3 Main Cr. Hollow End, 20007. Has some type of official stamp sealing the envelope.", 
            "item_letter.png",
            undefined,
            0, 0, idleAnimation, undefined, undefined, undefined)];
    }

    update(level) {
        const oldX = this.tileX;
        const oldY = this.tileY;

        super.update(level);
        if (this.aStarPath.length > 0) {
            this.camera.x = this.x + 0.5;
            this.camera.y = this.y + 0.5;
        }

        if (oldX !== this.tileX || oldY !== this.tileY) {
            GLOBAL_AUDIO_HANDLER.playTileStep(level.tiles[this.tileX][this.tileY].name);
        }
    }
}