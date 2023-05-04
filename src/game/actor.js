import { aStar } from "./astar";


export class Actor {
    constructor(level, x, y, idleAnimation, moveLeftAnimation = undefined, moveRightAnimation = undefined) {
        this.x = x;
        this.y = y;
        
        this.tileX = Math.floor(x);
        this.tileY = Math.floor(y);

        this.offsetX = this.tileX;
        this.offsetY = this.tileY;
        if (level) {
            level.tiles[this.tileX][this.tileY].actor = this;
        }
        this.speed = 0.2;

        if (moveLeftAnimation && moveRightAnimation) {
            this.moveLeftAnimation = moveLeftAnimation.copy();
            this.moveRightAnimation = moveRightAnimation.copy();
        } else {
            this.stationary = true;
        }
        this.idleAnimation = idleAnimation.copy();
        this.activeAnimation = this.idleAnimation;
        this.activeAnimation.start();

        this.aStarPath = [];
    }

    aStarTo(level, x, y, checkForActors = true) {
        if (level.tiles[x][y].passable && (!checkForActors || (checkForActors && !level.tiles[x][y].actor))) {
            const path = aStar({x: this.tileX, y: this.tileY}, {x: x, y: y}, level.tiles, checkForActors);
            if (path.length > 0 && path.length < 11) {
                this.aStarPath = path;
                const newWalkAngle = Math.atan2(this.aStarPath[0].x - this.tileX, this.aStarPath[0].y - this.tileY);
                this.startMoveAnimation(newWalkAngle);
            }
        }
    }

    startMoveAnimation(angle) {
        this.stopAllAnimations();
        if (angle >= 0 && angle < 3) {
            this.moveRightAnimation.start();
            this.activeAnimation = this.moveRightAnimation;
        } else {
            this.moveLeftAnimation.start();
            this.activeAnimation = this.moveLeftAnimation;
        }

    }

    startIdleAnimation() {
        this.stopAllAnimations();
        this.idleAnimation.start();
        this.activeAnimation = this.idleAnimation;
    }

    stopAllAnimations() {
        this.moveRightAnimation.stop();
        this.moveLeftAnimation.stop();
        this.idleAnimation.stop();
    }

    update(level) {
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
                if (!level.tiles[this.tileX][this.tileY].actor) {
                    level.tiles[oldTileX][oldTileY].actor = undefined;
                    level.tiles[this.tileX][this.tileY].actor = this;
                } else {
                    this.tileX = oldTileX;
                    this.tileY = oldTileY;
                    this.x = oldTileX;
                    this.y = oldTileY;
                    this.offsetX = oldTileX;
                    this.offsetY = oldTileY;

                    if (this.aStarPath.length > 0) {
                        this.aStarTo(level, this.aStarPath[this.aStarPath.length - 1].x, this.aStarPath[this.aStarPath.length - 1].y);
                    }                    
                }
                
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