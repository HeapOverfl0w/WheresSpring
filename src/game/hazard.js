import { Actor } from "./actor";
import { GLOBAL_AUDIO_HANDLER } from "./audio-handler";

export class Hazard extends Actor {
    constructor(name, teleportX, teleportY, level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined, movementPoints = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation, movementPoints);
        this.name = name;
        this.teleportX = teleportX;
        this.teleportY = teleportY;

        if (movementPoints) {
            this.movementPoints = movementPoints;
            this.currentMovementPoint = 0;
        }
    }

    teleportActor(level, actor) {
        level.tiles[actor.tileX][actor.tileY].actor = undefined;
        level.tiles[this.teleportX][this.teleportY].actor = actor;
        actor.tileX = this.teleportX;
        actor.tileY = this.teleportY;
        actor.x = this.teleportX;
        actor.y = this.teleportY;
        actor.offsetX = this.teleportX;
        actor.offsetY = this.teleportY;
        if (actor.camera) {
            actor.camera.x = actor.x + 0.5;
            actor.camera.y = actor.y + 0.5;
        }
        actor.aStarPath = []; 
        actor.startIdleAnimation();
    }

    update(level) {
        if (!this.stationary && (!this.aStarPath || this.aStarPath.length === 0)) {
            this.currentMovementPoint++;
            if (this.currentMovementPoint >= this.movementPoints.length) {
                this.currentMovementPoint = 0;
            }

            this.aStarTo(level, this.movementPoints[this.currentMovementPoint].x, this.movementPoints[this.currentMovementPoint].y, false);
        }

        if (this.aStarPath.length > 0) {
            const walkAngle = Math.atan2(this.aStarPath[0].x - this.tileX, this.aStarPath[0].y - this.tileY);
            this.x += Math.sin(walkAngle) * this.speed;
            this.y += Math.cos(walkAngle) * this.speed;

            const oldTileX = this.tileX;
            const oldTileY = this.tileY;
            
            this.offsetX += Math.sin(walkAngle + Math.PI/4) * this.speed / 1.7;
            this.tileX = this.tileX > this.aStarPath[0].x ? Math.ceil(this.x) : Math.floor(this.x);

            this.offsetY += Math.cos(walkAngle + Math.PI/4) * this.speed / 1.7;
            this.tileY = this.tileY > this.aStarPath[0].y ? Math.ceil(this.y) : Math.floor(this.y);

            if ((this.tileX === this.aStarPath[0].x && this.tileY === this.aStarPath[0].y)) {
                this.offsetX = this.tileX;
                this.offsetY = this.tileY;
                this.x = this.tileX;
                this.y = this.tileY;
                this.aStarPath.shift();

                //check for collisions when moving forward
                if (level.tiles[this.tileX][this.tileY].actor) {
                    GLOBAL_AUDIO_HANDLER.playOw();
                    this.teleportActor(level, level.tiles[this.tileX][this.tileY].actor);
                }

                level.tiles[oldTileX][oldTileY].actor = undefined;
                level.tiles[this.tileX][this.tileY].actor = this;
                
                if (this.aStarPath.length === 0) {
                    this.x = this.tileX;
                    this.y = this.tileY;
                    this.startIdleAnimation();
                } else {
                    const newWalkAngle = Math.atan2(this.aStarPath[0].x - this.tileX, this.aStarPath[0].y - this.tileY);
                    if (walkAngle !== newWalkAngle) {
                        this.startMoveAnimation(newWalkAngle);
                    }
                }
            }
        }
    }
}