import { Data } from './data';
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
import { ItemRequirement } from './item-requirement';
import { GLOBAL_AUDIO_HANDLER } from './audio-handler';
import { WebGLRenderer } from './webgl-renderer';

export class Main {
    constructor(webglApp) {
        this.webglApp = webglApp;
    }

    async load(onLoadingProgress) {
        this.data = new Data(onLoadingProgress);
        await this.data.load();
        this.webglRenderer = new WebGLRenderer(this.webglApp, this.data)
        this.camera = new Camera();
        this.camera.x = 88.5;
        this.camera.y = 66.5;

        this.mouseX = 0;
        this.mouseY = 0;

        this.activeCutscene = this.data.introCutscene;

        this.loadLevel(Overworld);
        this.createOverworldActors();

        this.player = new Player(this.camera, this.level, 88, 66, this.data.animations['player'], this.data.animations['playerLeftMove'], this.data.animations['playerRightMove']);

        this.drawObjects = true;
        
        this.start();

    }

    createOverworldActors() {
        this.overworldActors = [];

        //items
        this.overworldActors.push(new Item("Snail Shell", 
        "A thick armored spiral gastropod shell. Doesn't look like anyone is home.", 
        "item_snailshell.png", this.level, 72, 74, this.data.animations["snailshell"].copy()));
        this.overworldActors.push(new Item("Magical Emerald", 
        "A shining green jewel. It glows with some type of magical power. (1/4)", 
        "item_emerald.png", this.level, 34, 55, this.data.animations["emerald"].copy()));
        this.overworldActors.push(new Item("Water Bucket", 
        "A bucket filled with water. This should be able to put out the fire at the dock house.", 
        "item_waterbucket.png", this.level, 10, 85, this.data.animations["waterbucket"].copy()));
        this.overworldActors.push(new Item("Tater", 
        "Amy's pet potato bug Tater. This rascal always getting away.", 
        "tater.png", this.level, 58, 12, this.data.animations["tater"].copy(), this.data.animations["taterLeftMove"].copy(), this.data.animations["taterRightMove"].copy(), 
        [{x: 51, y: 12}, {x: 51, y: 17}, {x: 58, y: 17}, {x: 58, y: 12}]));

        //npcs
        this.overworldActors.push(new Npc("Sign Post",
            "Follow path to Hollow End. South to South Beach. North to Mount's Peak. West to Hedge Maze.", "dialog.png", undefined, this.level, 79, 64, this.data.animations["signpost"].copy()));
        this.overworldActors.push(new Npc("Oscar",
            "Oscar: I swam up here in a hurry. Looks like Bogart is in trouble down by the docks. He might need some help!", "dialog_oscar.png", undefined, this.level, 64, 33, this.data.animations["oscar"].copy()));
        this.overworldActors.push(new Npc("Blue",
            "Blue: I love coming up here and singing while the sun sets. You're looking for spring? She hasn't come out of her hole yet?", "dialog_blue.png", undefined, this.level, 37, 9, this.data.animations["blue"].copy()));
        this.overworldActors.push(new Npc("Rudy",
            "Rudy: No! I don't want spring to come. I love playing in the snow. Momma won't let me play next to that big green thing just below here though. She says it's unnatural.", "dialog_rudy.png", undefined, this.level, 70, 58, this.data.animations["rudyLeftMove"].copy(), 
            this.data.animations["rudyLeftMove"].copy(), this.data.animations["rudyRightMove"].copy(), [{x: 61, y: 58}, {x: 61, y: 64}, {x: 70, y: 64}, {x: 70, y: 58}]));
        this.overworldActors.push(new Npc("Lauren",
            "Lauren: Whew, this hedge maze is brutal... even without the foliage. I'm going to rest before trying again. I've heard there's an ancient treasure at the end, but I don't think anyone has ever been able to find their way through.", 
            "dialog_lauren.png", undefined, this.level, 55, 53, this.data.animations["lauren"].copy()));
        this.overworldActors.push(new Npc("Audrey",
            "Audrey: I don't know where Spring is at, but it better get here quick. The water is so cold.", 
            "dialog_dusty.png", undefined, this.level, 69, 38, this.data.animations["dusty"].copy()));
        this.overworldActors.push(new Npc("Collins",
            "Collins: I haven't seen spring, but gosh darnit I wish I have. We need to start growing some crops or we ain't gunna have no food for the summer.", 
            "dialog_collins.png", undefined, this.level, 78, 43, this.data.animations["collins"].copy()));
        this.overworldActors.push(new Npc("Bogart",
            "Bogart: Oh boy, oh boy... Bees invaded the dock house. I lit the fireplace and they came in to get warm. You're small. You think you could sneak by them and put out the fire? I dropped a bucket of water inside when I ran out.", 
            "dialog_bogart.png", 
            new ItemRequirement(["Empty Bucket"], "Bogart: Wow! Thank you for putting out the fire. They should be finding their way out soon. Here, have this item I found that warshed up on shore. Maybe you can find a use for it.", 
                new Item("Staff Handle", "A golden cylinder of some sort. Looks like it could be used as a handle to something. (3/4)", "item_staffhandle.png", this.level, 0, 0, this.data.animations["emerald"].copy())), 
            this.level, 29, 34, this.data.animations["bogart"].copy()));
        this.overworldActors.push(new Npc("Fireplace",
            "This is the fireplace Bogart was asking us to dowse the flame on. I need to find the bucket - it's in the dock house somewhere.", "dialog_fireplace.png", 
            new ItemRequirement(["Water Bucket"], "Throwing the water on the fire smothered it out. Bogart will be pleased and the bees will be gone soon for sure.", 
                new Item("Empty Bucket", "It's an empty bucket. We should show this to Bogart to prove we put the fire out at the dock house.", "item_emptybucket.png", 
                this.level, 0, 0, this.data.animations["emerald"].copy()), this.data.animations['fireplacecold'].copy(),), 
            this.level, 22, 87, this.data.animations['fireplacewarm'].copy()));
        this.overworldActors.push(new Npc("Amy",
            "Amy: Have you seen my pet Tater? I've been looking for him every where. If you see him please bring him back to me. He loves playing in the snow.", 
            "dialog_amy.png", 
            new ItemRequirement(["Tater"], "Amy: Tater! Yes! Thank you! I'm going to keep a close eye on him from now on. Here, I found this piece of wood that looks like it's a piece to something else. Maybe you can find a use for it.", 
                new Item("Staff Base", "A stick with a golden end to it. Looks like the base of a tool or something. (4/4)", "item_staffbase.png", this.level, 0, 0, this.data.animations["emerald"].copy())), 
            this.level, 60, 50, this.data.animations["amy"].copy()));
        this.overworldActors.push(new Npc("Thomas",
            "Thomas: Man... Arnold's got me working constantly. And on dumb stuff too - now he wants me to find a shell that could be used for armor. I think I saw some over by south beach, do you think you could find one so I could take a break?", 
            "dialog_thomas.png", 
            new ItemRequirement(["Snail Shell"], "Thomas: Whew, thanks bud. You did me a solid. Here's a staff head that Arnold said is super valuable, but without the other parts it's useless to me.", 
                new Item("Staff Head", "A gnarled branch that looks like it could sit a magical gem into. (2/4)", "item_staffhead.png", this.level, 0, 0, this.data.animations["emerald"].copy())), 
            this.level, 62, 27, this.data.animations["thomas"].copy()));
        this.overworldActors.push(new Npc("Arnold",
            "Arnold: Spring? I don't know - haven't seen 'er. I've been working all through winter while most around here are hibernating. Listen son - I can forge anything. If you need someone to craft you something you come to me.", 
            "dialog_arnold.png", 
            new ItemRequirement(["Staff Head", "Magical Emerald", "Staff Handle", "Staff Base"], "Arnold: Unbelievable, how'd you find all the lost parts to the Ever Verdant Staff? It has the power to move large objects, but had been lost to time. It would be my honor to reassemble it for you.", 
                new Item("Ever Verdant Staff", "The ancient staff that was reassembled by Arnold. He claimed it has the ability to move large objects that are unnatural.", "item_staff.png", this.level, 0, 0, this.data.animations["emerald"].copy())), 
            this.level, 67, 27, this.data.animations["arnold"].copy()));
        this.overworldActors.push(new Npc("Glass Bottle",
            "This glass bottle is clogging up some type of hole here?", 
            "dialog_glassbottle.png", 
            new ItemRequirement(["Letter for Spring", "Ever Verdant Staff"], "Spring: Good grief. I overslept! Normally someone would wake me up by this time so we can get spring started y'all! Oh, you also have a letter for me? Let's see what it says: THANK YOU FOR PLAYING WHERE'S SPRING? THE END.", undefined, this.data.animations["spring"], "dialog_spring.png", "Spring"), 
            this.level, 58, 70, this.data.animations["glassbottle"].copy()));

        //teleports
        this.overworldActors.push(new Teleport("Dock House", 10, 89, "bee", this.level, 30, 30, this.data.animations["dockhouse"].copy()));
        this.overworldActors.push(new Teleport("Hollow End", 30, 32, "ambience", this.level, 9, 89, this.data.animations["doorway"].copy()));

        //hazards
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 13, 85, this.data.animations["beeRightMove"].copy(), 
        this.data.animations["beeLeftMove"].copy(), this.data.animations["beeRightMove"].copy(), [{x: 13, y: 89}, {x: 13, y: 85}]));
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 17, 85, this.data.animations["beeRightMove"].copy(), 
        this.data.animations["beeLeftMove"].copy(), this.data.animations["beeRightMove"].copy(), [{x: 17, y: 88}, {x: 17, y: 85}]));
        this.overworldActors.push(new Hazard("Bee", 10, 89, this.level, 20, 89, this.data.animations["beeRightMove"].copy(), 
        this.data.animations["beeLeftMove"].copy(), this.data.animations["beeRightMove"].copy(), [{x: 20, y: 85}, {x: 20, y: 89}]));
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
                levelObject.tiles[x][y].activeAnimation = this.data.animations[levelObject.tiles[x][y].activeAnimation].copy();
                levelObject.tiles[x][y].activeAnimation.start();
                if (levelObject.tiles[x][y].levelObject) {
                    levelObject.tiles[x][y].levelObject.activeAnimation = this.data.animations[levelObject.tiles[x][y].levelObject.activeAnimation].copy();
                    Object.setPrototypeOf(levelObject.tiles[x][y].levelObject, LevelObject.prototype);
                    levelObject.tiles[x][y].levelObject.activeAnimation.start();
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
        this.webglApp.stage.removeChildren();
        if (this.activeCutscene) {
            this.activeCutscene.update();
            this.activeCutscene.draw(this.webglApp.stage, this.webglApp.view.width, this.webglApp.view.height);

            return;
        }

        for (let a = 0; a < this.overworldActors.length; a++) {
            if (this.overworldActors[a].update) {
                this.overworldActors[a].update(this.level);
            }
        }
        this.player.update(this.level);
        this.webglRenderer.draw(this.player, this.level, this.mouseX, this.mouseY, [], false, true, this.drawObjects);
        this.webglRenderer.drawPlayerInteraction(this.player, this.overworldActors);

        GLOBAL_AUDIO_HANDLER.update();
    }

    handleMouseWheel(deltaY) {
        let delta = 1;
        if (deltaY < 0) {
            delta = -1;
        }

        const newZoom = this.camera.zoom + delta;
        if (newZoom > 2 && newZoom < 11) {
            this.camera.zoom = newZoom;
        }
    }

    handleMouseUp() {
        this.mouseDown = false;
        if (!this.player.aStarPath || this.player.aStarPath.length === 0) {
            this.player.aStarTo(this.level, this.webglRenderer.mouseTileX, this.webglRenderer.mouseTileY);
        }
    }

    handleKeyDown() {
        this.mouseDown = true;
    }

    handleKeyUp(key) {
        if (this.activeCutscene) {
            if (this.activeCutscene.skippable || this.activeCutscene.isOver()) {
                
                if (this.activeCutscene === this.data.introCutscene) {
                    GLOBAL_AUDIO_HANDLER.playAndLoopMusic();
                    GLOBAL_AUDIO_HANDLER.playAmbience("ambience");

                    this.activeCutscene = undefined;

                    return {
                        dialogText: "Alright, last letter to deliver today. Whew, good. Maybe I can make it home before it gets dark.",
                        dialogImage: "dialog_player.png"
                    }
                }

                this.activeCutscene = undefined;
            }
            return;
        }
        if (key === 'e') {
            for (let a = 0; a < this.overworldActors.length; a++) {
                if (this.overworldActors[a].isCloseTo && this.overworldActors[a].isCloseTo(this.player.x, this.player.y)) {
                    GLOBAL_AUDIO_HANDLER.playClick();
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