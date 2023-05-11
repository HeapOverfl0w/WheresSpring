import { TILE_WIDTH, TILE_HEIGHT, TILE_HEIGHT_OFFSET_RATIO, hexToRgbOffset } from './constants';
import { Sprite } from 'pixi.js';

export class WebGLRenderer {
    constructor(webglApp) {
        this.mouseTileX = 0;
        this.mouseTileY = 0;
        this.lastDrawTime = 0;

        this.canvasWidth = webglApp.view.width;
        this.canvasHeight = webglApp.view.height;

        this.backpackIcon = new Sprite(webglApp.loader.resources['backpackIcon'].texture);
        this.backpackIcon.x = this.canvasWidth - this.backpackIcon.width - 5;
        this.backpackIcon.y = this.canvasHeight - this.backpackIcon.height - 5;

        this.eIcon = new Sprite(webglApp.loader.resources['eIcon'].texture);
        this.eIcon.x = ctx.canvas.width/2 - 20;
        this.eIcon.y = ctx.canvas.height/2 - 10;

        this.webglContext = webglApp.stage;        
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    drawPlayerInteraction(player, actors) {
        for (let a = 0; a < actors.length; a++) {
            const actionString = actors[a].isCloseTo ? actors[a].isCloseTo(player.x, player.y) : undefined;
            if (actionString) {
                this.webglContext.addChild(eIcon);
                //ctx.fillStyle = "white";
                //ctx.fillText(actionString, ctx.canvas.width/2, ctx.canvas.height/2);
                break;
            }
        }
    }

    draw(player, level, mouseX, mouseY, aStarPath = [], drawNonPassables = false, drawLightSources = false, drawObjects = true) {
        //ctx.fillRect(0, ctx.canvas.width, ctx.canvas.height);
        const camera = player.camera;

        const startX = Math.floor(camera.x) - camera.zoom;
        const startY = Math.floor(camera.y) - camera.zoom;
        const startOffsetX = camera.x - Math.floor(camera.x);
        const startOffsetY = camera.y - Math.floor(camera.y);
        const tileWidth = this.canvasWidth / camera.zoom;
        const tileHeight = this.canvasHeight / camera.zoom;

        let extraCameraSpace = Math.ceil(camera.zoom / 10 * 2.6);

        let tilesToDraw = [];

        let ambientRgb = hexToRgbOffset(level.ambientLight);

        this.webglContext.removeChildren();

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
                        
                        let isAStarPath = aStarPath.find((item) => item.x === tilesToDraw[t].x && item.y === tilesToDraw[t].y) !== undefined;
                        let isMouseInside = this.drawTile(
                            tilesToDraw[t].tile, 
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
                        }
                        
                        if (drawObjects && level.tiles[x][y].levelObject) {
                            let isMouseInside = this.drawGameObject(ctx, level.tiles[x][y], level.tiles[x][y].levelObject, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, ambientRgb);
                            if (isMouseInside) {
                                this.mouseTileX = x;
                                this.mouseTileY = y;
                            }
                        }
                        
                        if (level.tiles[x][y].actor) {
                            this.drawGameObject(
                                level.tiles[x][y], 
                                level.tiles[x][y].actor, 
                                tileX, tileY, 
                                tileWidth, tileHeight, 
                                mouseX, mouseY, 
                                ambientRgb, 
                                true);
                        }
                    } 
                }
            }
        }
        
        this.webglContext.addChild(this.backpackIcon);
    }

    drawTile(tile, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, isAStarPath, drawNonPassables, drawLightSources, ambientRgb) {
        const tileSprite = tile.activeAnimation.sprite;

        tileSprite.x = tileX;
        tileSprite.y = tileY;
        tileSprite.width = tileWidth;
        tileSprite.height = tileHeight;

        if (drawLightSources) {
            tileSprite.tint = rgbToHex(Math.floor(tile.lightCoefficient * ambientRgb.r), Math.floor(tile.lightCoefficient * ambientRgb.g), Math.floor(tile.lightCoefficient * ambientRgb.b))
        } else if (isAStarPath) {
            tileSprite.tint = "#031CFC"
        } else if (drawNonPassables) {
            tileSprite.tint = "#F50525"
        } else {
            tileSprite.tint = "0xFFFFFF"
        }

        this.webglContext.addChild(tileSprite);

        return tileX <= mouseX && mouseX >= tileX + tileWidth && tileY <= mouseY && mouseY >= tileY + tileHeight;
    }

    drawGameObject(tile, object, tileX, tileY, tileWidth, tileHeight, mouseX, mouseY, ambientRgb, isActor = false) {
        const objectSprite = object.activeAnimation.sprite;
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

        objectSprite.x = startX;
        objectSprite.y = startY;
        objectSprite.width = tileWidth;
        objectSprite.height = tileHeight;

        if (drawLightSources) {
            tileSprite.tint = rgbToHex(Math.floor(tile.lightCoefficient * ambientRgb.r), Math.floor(tile.lightCoefficient * ambientRgb.g), Math.floor(tile.lightCoefficient * ambientRgb.b))
        } else {
            tileSprite.tint = "0xFFFFFF"
        }

        this.webglContext.addChild(tileSprite);

        return tileX <= mouseX && mouseX >= tileX + tileWidth && tileY <= mouseY && mouseY >= tileY + tileHeight;
    }
}