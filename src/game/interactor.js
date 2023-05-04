import { Actor } from "./actor";

export class Interactor extends Actor {
    constructor(level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined, movementPoints = undefined) {
        super(level, x, y, idleAnimation, moveLeftAnimation, moveRightAnimation);

        if (movementPoints) {
            this.movementPoints = movementPoints;
            this.currentMovementPoint = 0;
        }
    }

    isCloseTo(x, y) {
        return Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) < 3;
    }

    update(level) {
        super.update(level);

        if (!this.stationary && (!this.aStarPath || this.aStarPath.length === 0)) {
            this.currentMovementPoint++;
            if (this.currentMovementPoint >= this.movementPoints.length) {
                this.currentMovementPoint = 0;
            }

            this.aStarTo(level, this.movementPoints[this.currentMovementPoint].x, this.movementPoints[this.currentMovementPoint].y);
        }
    }
}