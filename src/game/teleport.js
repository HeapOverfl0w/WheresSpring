import { GLOBAL_AUDIO_HANDLER } from "./audio-handler";
import { Interactor } from "./interactor";

export class Teleport extends Interactor {
    constructor(name, teleportX, teleportY, ambienceSoundName, level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined, movementPoints = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation, movementPoints);
        this.name = name;
        this.teleportX = teleportX;
        this.teleportY = teleportY;
        this.ambienceSoundName = ambienceSoundName;
    }

    isCloseTo(x, y) {
        if (super.isCloseTo(x, y)) {
            return `Enter ${this.name}`;
        }
    }

    interact(level, player) {
        level.tiles[player.tileX][player.tileY].actor = undefined;
        level.tiles[this.teleportX][this.teleportY].actor = player;
        player.tileX = this.teleportX;
        player.tileY = this.teleportY;
        player.x = this.teleportX;
        player.y = this.teleportY;
        player.offsetX = this.teleportX;
        player.offsetY = this.teleportY;
        player.camera.x = player.x + 0.5;
        player.camera.y = player.y + 0.5;
        player.startIdleAnimation();

        GLOBAL_AUDIO_HANDLER.playAmbience(this.ambienceSoundName);
    }
}