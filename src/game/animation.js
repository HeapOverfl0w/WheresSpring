/* Basic Animation class - only uses a single image for the whole animation where the 
animation starts at 0,0. */

import { Texture, AnimatedSprite, Sprite, Rectangle } from "pixi.js";

export class Animation {
    constructor(name, baseTexture, frameWidth, frameHeight, frameCount, frameTimeMs, repeats) {
        this.name = name;
        this.baseTexture = baseTexture;
        this.textureFrames = [];
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.currentFrame = 0;
        this.animating = false;
        this.frameTimeMs = frameTimeMs;
        this.repeats = repeats;

        if (frameCount > 1) {
            for (let t = 0; t < frameCount; t++) {
                this.textureFrames.push(new Texture(baseTexture, new Rectangle(0, t * frameHeight, frameWidth, frameHeight)));
            }

            this.webglSprite = new AnimatedSprite(this.textureFrames);
            this.webglSprite.animationSpeed = frameTimeMs / 1000;
            this.webglSprite.loop = repeats;
        } else {
            this.webglSprite = new Sprite(baseTexture);
        }       
    }

    start() {
        if (this.frameCount == 1)
            return;
        
        this.webglSprite.gotoAndPlay(0);
    }

    stop() {
        if (this.frameCount == 1)
            return;

        this.webglSprite.stop();
    }

    isAnimating() {
        if (this.frameCount == 1)
            return false;

        return this.webglSprite.playing;
    }

    copy() {
        return new Animation(this.name, this.baseTexture, this.frameWidth, this.frameHeight, this.frameCount, this.frameTimeMs, this.repeats);
    }
}