import { TILE_WIDTH, TILE_HEIGHT, TILE_HEIGHT_OFFSET_RATIO, hexToRgbOffset } from './constants';

export class Renderer {
    constructor() {
        this.mouseTileX = 0;
        this.mouseTileY = 0;
        this.lastDrawTime = 0;

        this.backgroundColor = "#48657D";
        this.backgroundRgb = {r: 72, g: 101, b: 125};

        this.backpackIcon = document.getElementById("backpackIcon");
        this.eIcon = document.getElementById("eIcon");
    }

    drawPlayerInteraction(ctx, player, actors) {
        for (let a = 0; a < actors.length; a++) {
            const actionString = actors[a].isCloseTo ? actors[a].isCloseTo(player.x, player.y) : undefined;
            if (actionString) {
                ctx.drawImage(this.eIcon, 5, ctx.canvas.height - 20);
                ctx.fillStyle = "white";
                ctx.fillText(actionString, 25, ctx.canvas.height - 10);
                break;
            }
        }
    }

    draw(ctx, player, level, mouseX, mouseY, aStarPath = [], drawNonPassables = false, drawLightSources = false, drawObjects = true) {
        //ctx.fillRect(0, ctx.canvas.width, ctx.canvas.height);
        const camera = player.camera;
        ctx.fillStyle = "#48657D";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.screenBuffer = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const startX = Math.floor(camera.x) - camera.zoom;
        const startY = Math.floor(camera.y) - camera.zoom;
        const startOffsetX = camera.x - Math.floor(camera.x);
        const startOffsetY = camera.y - Math.floor(camera.y);
        const tileWidth = ctx.canvas.width / camera.zoom;
        const tileHeight = ctx.canvas.height / camera.zoom;

        let tileText = "";
        let extraCameraSpace = Math.ceil(camera.zoom / 10 * 2.6);

        let tilesToDraw = [];

        let ambientRgb = hexToRgbOffset(level.ambientLight);

        for(let x = startX + camera.zoom * 2 + 5; x > startX - extraCameraSpace; x--) {
            for (let y = startY - 5; y < startY + camera.zoom * 2 + extraCameraSpace; y++) {
                if (x > -1 && x < level.tiles.length && y > -1 && y < level.tiles[x].length) {
                    //reposition to line up for isometric
                    let tileX = Math.floor((x - startOffsetX - startX - camera.zoom) * tileWidth/2 + (y - startY - startOffsetY ) * tileWidth/2);
                    let tileY = Math.floor((y - startY - startOffsetY) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2 - (x - startOffsetX - startX  - camera.zoom) * (tileHeight - (TILE_HEIGHT_OFFSET_RATIO * tileHeight))/2);
                    let tileBottomX = tileX + tileWidth;
                    let tileBottomY = tileY + tileHeight;

                    //only draw if it's in viewport, check by looking at each tile corner and verifying that at least one of them is in the viewport
                    if ((tileX > -1 && tileX < ctx.canvas.width && tileY > -1 && tileY < ctx.canvas.height) || 
                        (tileBottomX > -1 && tileBottomX < ctx.canvas.width && tileBottomY > -1 && tileBottomY < ctx.canvas.height) || 
                        (tileBottomX > -1 && tileBottomX < ctx.canvas.width && tileY > -1 && tileY < ctx.canvas.height) || 
                        (tileX > -1 && tileX < ctx.canvas.width && tileBottomY > -1 && tileBottomY < ctx.canvas.height)) {
                        if(level.tiles[x][y]) {
                            tilesToDraw.unshift({
                                tile: level.tiles[x][y],
                                tileX: tileX,
                                tileY: tileY,
                                x: x,
                                y: y                                
                            });
                        }
                        
                        if (drawObjects && level.tiles[x][y].levelObject) {
                            let isMouseInside = this.drawGameObject(ctx, level.tiles[x][y], level.tiles[x][y].levelObject, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, ambientRgb);
                            if (isMouseInside) {
                                this.mouseTileX = x;
                                this.mouseTileY = y;
                                tileText = `X: ${this.mouseTileX} , Y: ${this.mouseTileY}, Zoom: ${camera.zoom}, Object: ${level.tiles[x][y].levelObject.name}`;
                            }
                        }
                        
                        if (level.tiles[x][y].actor) {
                            this.drawGameObject(ctx, level.tiles[x][y], level.tiles[x][y].actor, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, ambientRgb, camera, true);
                        }
                    } 
                }
            }
        }

        for (let t = 0; t < tilesToDraw.length; t++) {
            let isAStarPath = aStarPath.find((item) => item.x === tilesToDraw[t].x && item.y === tilesToDraw[t].y) !== undefined;
            let isMouseInside = this.drawTile(
                ctx, tilesToDraw[t].tile, 
                Math.floor(tilesToDraw[t].tileX), 
                Math.floor(tilesToDraw[t].tileY), 
                tileWidth, tileHeight, 
                mouseX, mouseY, 
                isAStarPath, 
                drawNonPassables,
                drawLightSources,
                ambientRgb);
            if (isMouseInside) {
                this.mouseTileX = tilesToDraw[t].x;
                this.mouseTileY = tilesToDraw[t].y;
                tileText = `X: ${this.mouseTileX} , Y: ${this.mouseTileY}, Zoom: ${camera.zoom}`;
            }
        }
        
        ctx.putImageData(this.screenBuffer, 0, 0);
        ctx.drawImage(this.backpackIcon, ctx.canvas.width - this.backpackIcon.width - 5, ctx.canvas.height - this.backpackIcon.height - 5)
        ctx.fillStyle = "white";
        ctx.fillText(tileText, 10, 10);
        ctx.fillText(`${Math.floor(1000 / (Date.now() - this.lastDrawTime))}`, ctx.canvas.width - 20, 10);
        this.lastDrawTime = Date.now();
    }

    drawTile(ctx, tile, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, isAStarPath, drawNonPassables, drawLightSources, ambientRgb) {
        const frameBuffer = tile.activeAnimation.getFrameBuffer();
        let isMouseInside = false;

        for (let x = tileX; x < tileX + tileWidth; x++) {
            for (let y = tileY; y < tileY + tileHeight; y++) {
                if (x > -1 && x < ctx.canvas.width &&
                    y > -1 && y < ctx.canvas.height) {
                        let bufferSample = 4 * (y * this.screenBuffer.width + x);
                        //first check that the buffer sample hasn't had an item drawn on it yet
                        if (this.screenBuffer.data[bufferSample] === this.backgroundRgb.r && this.screenBuffer.data[bufferSample + 1] === this.backgroundRgb.g && this.screenBuffer.data[bufferSample + 2] === this.backgroundRgb.b) {
                            let xTextureSample = Math.floor(((x - tileX) / tileWidth) * TILE_WIDTH);
                            let yTextureSample = Math.floor(((y - tileY) / tileHeight) * TILE_HEIGHT);
                            let textureSample = 4 * (yTextureSample * TILE_WIDTH + xTextureSample);
                            let textureBuffer = frameBuffer.data;
                            if (textureBuffer[textureSample + 3] === 255 && textureBuffer[textureSample] !== undefined) {
                                if ((4 * (mouseY * this.screenBuffer.width + mouseX)) === bufferSample) {
                                    isMouseInside = true;
                                }
                                if (drawNonPassables && !tile.passable && x % 3 === 0) {
                                    this.screenBuffer.data[bufferSample] = 255;
                                    this.screenBuffer.data[bufferSample + 1] = 0;
                                    this.screenBuffer.data[bufferSample + 2] = 0;
                                } else if (isAStarPath && x % 3 === 0) {
                                    this.screenBuffer.data[bufferSample] = 0;
                                    this.screenBuffer.data[bufferSample + 1] = 0;
                                    this.screenBuffer.data[bufferSample + 2] = 255;
                                } else {
                                    this.screenBuffer.data[bufferSample] = textureBuffer[textureSample] + tile.lightCoefficient * ambientRgb.r;
                                    this.screenBuffer.data[bufferSample + 1] = textureBuffer[textureSample + 1] + tile.lightCoefficient * ambientRgb.g;
                                    this.screenBuffer.data[bufferSample + 2] = textureBuffer[textureSample + 2] + tile.lightCoefficient * ambientRgb.b;
                                }
                                
                                if (drawLightSources && tile.lightCoefficient === 0 && x % 5 === 0) {
                                    this.screenBuffer.data[bufferSample] = 255;
                                    this.screenBuffer.data[bufferSample + 1] = 255;
                                    this.screenBuffer.data[bufferSample + 2] = 0;
                                }
                                
                                this.screenBuffer.data[bufferSample + 3] = 255;
                            }
                        }
                    }
            }
        }

        return isMouseInside;
    }

    drawGameObject(ctx, tile, object, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, ambientRgb, camera, isActor = false) {
        const frameBuffer = object.activeAnimation.getFrameBuffer();
        //get scaled width/height
        let zoomWidth = Math.floor(frameBuffer.width * tileWidth / TILE_WIDTH);
        let zoomHeight = Math.floor(frameBuffer.height * tileHeight / TILE_HEIGHT); 

        let startX = 0;
        let startY = 0;

        if (isActor) {
            startX = Math.floor(tileX + tileWidth/2 - zoomWidth/2 + (object.offsetX - object.tileX) * tileWidth);
            startY = Math.floor(tileY + tileHeight/2 - zoomHeight + (object.offsetY - object.tileY) * tileHeight);
        } else {
            startX = Math.floor(tileX + tileWidth/2 - zoomWidth/2);
            startY = Math.floor(tileY + tileHeight - zoomHeight);
        }

        let isMouseInside = false;

        for (let x = startX; x < startX + zoomWidth; x++) {
            for (let y = startY; y < startY + zoomHeight; y++) {
                if (x > -1 && x < ctx.canvas.width &&
                    y > -1 && y < ctx.canvas.height) {
                        let xTextureSample = Math.floor(((x - startX) / zoomWidth) * frameBuffer.width);
                        let yTextureSample = Math.floor(((y - startY) / zoomHeight) * frameBuffer.height);
                        let textureSample = 4 * (yTextureSample * frameBuffer.width + xTextureSample);
                        let bufferSample = 4 * (y * this.screenBuffer.width + x);
                        let textureBuffer = frameBuffer.data;

                        if ((4 * (mouseY * this.screenBuffer.width + mouseX)) === bufferSample) {
                            isMouseInside = true;
                        }

                        if (textureBuffer[textureSample + 3] === 255 && textureBuffer[textureSample] !== undefined) {
                            this.screenBuffer.data[bufferSample] = textureBuffer[textureSample] + tile.lightCoefficient * ambientRgb.r;
                            this.screenBuffer.data[bufferSample + 1] = textureBuffer[textureSample + 1] + tile.lightCoefficient * ambientRgb.g;
                            this.screenBuffer.data[bufferSample + 2] = textureBuffer[textureSample + 2] + tile.lightCoefficient * ambientRgb.b;
                            this.screenBuffer.data[bufferSample + 3] = 255;
                        }
                    }
            }
        }

        return isMouseInside;
    }
}