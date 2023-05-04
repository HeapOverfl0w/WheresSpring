import { Renderer } from './renderer';
import { Camera } from './camera';
import { Level } from './level';
import { Tile } from './tile';
import { LevelObject } from './level-object';
import { Player } from './player';
import { Item } from './item';

import * as Overworld from '../levels/overworld.json';
import { Npc } from './npc';
import { Teleport } from './teleport';
import { Hazard } from './hazard';

export class Main {
    constructor(ctx, data) {
        this.ctx = ctx;
        this.data = data;

        this.renderer = new Renderer();
        this.camera = new Camera();
        this.camera.x = 88.5;
        this.camera.y = 66.5;

        this.mouseX = 0;
        this.mouseY = 0;

        this.loadLevel(Overworld);
        this.createOverworldActors();

        this.player = new Player(this.camera, this.level, 88, 66, this.data.animations['player'], this.data.animations['playerLeftMove'], this.data.animations['playerRightMove']);

        this.drawObjects = true;
    }

    createOverworldActors() {
        this.overworldActors = [];

        //items
        this.overworldActors.push(new Item("Snail Shell", 
        "A thick armored spiral gastropod shell. Doesn't look like anyone is home.", 
        "item_snailshell.png", this.level, 72, 74, this.data.animations["snailshell"]));
        this.overworldActors.push(new Item("Magical Emerald", 
        "A shining green jewel. It glows with some type of magical power.", 
        "item_emerald.png", this.level, 34, 55, this.data.animations["emerald"]));
        this.overworldActors.push(new Item("Tater", 
        "Amy's pet potato bug Tater. This rascal always getting away.", 
        "tater.png", this.level, 58, 12, this.data.animations["tater"], this.data.animations["taterLeftMove"], this.data.animations["taterRightMove"], 
        [{x: 51, y: 12}, {x: 51, y: 17}, {x: 58, y: 17}, {x: 58, y: 12}]));

        //npcs
        this.overworldActors.push(new Npc("Sign Post",
        "Welcome to Hollow End.", "dialog.png", [], this.level, 79, 64, this.data.animations["signpost"]));
        this.overworldActors.push(new Npc("Lauren",
        "Lauren: Whew, this hedge maze is brutal... even without the foliage. I'm going to rest before trying again. I've heard there's an ancient treasure at the end, but I don't think anyone has ever been able to find their way through.", 
        "dialog_lauren.png", [], this.level, 55, 53, this.data.animations["lauren"]));

        //teleports
        this.overworldActors.push(new Teleport("Dock House", 10, 89, this.level, 30, 31, this.data.animations["dockhouse"]));

        //hazards
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 13, 85, this.data.animations["beeRightMove"], 
        this.data.animations["beeLeftMove"], this.data.animations["beeRightMove"], [{x: 13, y: 89}, {x: 13, y: 85}]));
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 17, 85, this.data.animations["beeRightMove"], 
        this.data.animations["beeLeftMove"], this.data.animations["beeRightMove"], [{x: 17, y: 88}, {x: 17, y: 85}]));
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 20, 89, this.data.animations["beeRightMove"], 
        this.data.animations["beeLeftMove"], this.data.animations["beeRightMove"], [{x: 20, y: 85}, {x: 20, y: 89}]));
    }

    stringifyLevel() {
        const tiles = [];
        for(let x = 0; x < this.level.tiles.length; x++) {
            tiles.push([]);
            for(let y = 0; y < this.level.tiles[x].length; y++) {
                let tileCopy = this.level.tiles[x][y].copy();
                tileCopy.activeAnimation = tileCopy.activeAnimation.name;
                if (tileCopy.levelObject) {
                    tileCopy.levelObject.activeAnimation = tileCopy.levelObject.activeAnimation.name;
                }
                tiles[x].push(tileCopy);
            }
        }

        const returnValue = new Level(tiles);
        returnValue.ambientLight = this.level.ambientLight;

        return JSON.stringify(returnValue);
    }

    destringifyAndLoadLevel(json) {
        const parsedLevel = JSON.parse(json);
        this.loadLevel(parsedLevel);
    }

    loadLevel(levelObject) {
        for(let x = 0; x < levelObject.tiles.length; x++) {
            for(let y = 0; y < levelObject.tiles[x].length; y++) {
                levelObject.tiles[x][y].activeAnimation = this.data.animations[levelObject.tiles[x][y].activeAnimation];
                if (levelObject.tiles[x][y].levelObject) {
                    levelObject.tiles[x][y].levelObject.activeAnimation = this.data.animations[levelObject.tiles[x][y].levelObject.activeAnimation];
                    Object.setPrototypeOf(levelObject.tiles[x][y].levelObject, LevelObject.prototype);
                }

                Object.setPrototypeOf(levelObject.tiles[x][y], Tile.prototype);
            }
        }

        this.level = Object.setPrototypeOf(levelObject, Level.prototype);
    }

    start() {
        this.updateInterval = setInterval(this.update.bind(this), 1000/30);
    }
    
    update() {
        for (let a = 0; a < this.overworldActors.length; a++) {
            if (this.overworldActors[a].update) {
                this.overworldActors[a].update(this.level);
            }
        }
        this.player.update(this.level);
        this.renderer.draw(this.ctx, this.player, this.level, this.mouseX, this.mouseY, this.player.aStarPath, true, true, this.drawObjects);
        this.renderer.drawPlayerInteraction(this.ctx, this.player, this.overworldActors);
    }

    handleMouseWheel(deltaY) {
        let delta = 1;
        if (deltaY < 0) {
            delta = -1;
        }

        this.camera.zoom += delta;
    }

    handleMouseUp() {
        this.mouseDown = false;
        if (!this.player.aStarPath || this.player.aStarPath.length === 0) {
            this.player.aStarTo(this.level, this.renderer.mouseTileX, this.renderer.mouseTileY);
        }
    }

    handleKeyDown() {
        this.mouseDown = true;
    }

    handleKeyUp(key) {
        if (key === 'e') {
            for (let a = 0; a < this.overworldActors.length; a++) {
                if (this.overworldActors[a].isCloseTo(this.player.x, this.player.y)) {
                    const dialogText = this.overworldActors[a].interact(this.level, this.player);

                    if (dialogText) {
                        return {dialogText: dialogText, dialogImage: this.overworldActors[a].dialogImage};
                    }

                    break;
                }
            }
        }
    }

    handleMouseMove(mouseX, mouseY) {
        this.mouseX = Math.floor(mouseX);
        this.mouseY = Math.floor(mouseY);
    }
}