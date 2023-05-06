import { Animation } from './animation';
import { LevelObject } from './level-object';
import { Tile } from './tile';

export class Data {
    constructor() {

    }

    load() {
        this.loadTextures();
        this.loadAnimations();
        this.loadTiles();
        this.loadLevelObjects();
    }

    loadTextures() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', {willReadFrequently: true});

        const textures = document.getElementById('textures');

        this.textures = {};

        for (let i = 0; i < textures.childElementCount; i++) {
            let img = textures.children[i];
            let imgName = img.src.split('\\').pop().split('/').pop().split('.')[0];
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            let imgData = ctx.getImageData(0, 0, img.width, img.height);
            this.textures[imgName] = imgData;
        }
    }

    loadAnimations() {
        this.animations = {};

        //tiles
        this.animations['empty'] = new Animation('empty', this.textures['empty'], 63, 38, 1, 0, false);
        this.animations['grass'] = new Animation('grass', this.textures['grass'], 63, 38, 1, 0, false);
        this.animations['grassflowers'] = new Animation('grassflowers', this.textures['grassflowers'], 63, 38, 2, 1000, true);
        this.animations['stone'] = new Animation('stone', this.textures['stone'], 63, 38, 1, 0, false);
        this.animations['stone1'] = new Animation('stone1', this.textures['stone1'], 63, 38, 1, 0, false);
        this.animations['rug1'] = new Animation('rug1', this.textures['rug1'], 63, 38, 1, 0, false);
        this.animations['rug2'] = new Animation('rug2', this.textures['rug2'], 63, 38, 1, 0, false);
        this.animations['asphalt'] = new Animation('asphalt', this.textures['asphalt'], 63, 38, 1, 0, false);
        this.animations['sidewalk1'] = new Animation('sidewalk1', this.textures['sidewalk1'], 63, 38, 1, 0, false);
        this.animations['sidewalk2'] = new Animation('sidewalk2', this.textures['sidewalk2'], 63, 38, 1, 0, false);
        this.animations['sidewalk3'] = new Animation('sidewalk3', this.textures['sidewalk3'], 63, 38, 1, 0, false);
        this.animations['water1'] = new Animation('water1', this.textures['water1'], 63, 38, 1, 0, false);
        this.animations['waterbubble'] = new Animation('waterbubble', this.textures['waterbubble'], 63, 38, 4, 1000, true);
        this.animations['mud1'] = new Animation('mud1', this.textures['mud1'], 63, 38, 1, 0, false);
        this.animations['mud2'] = new Animation('mud2', this.textures['mud2'], 63, 38, 1, 0, false);
        this.animations['sand1'] = new Animation('sand1', this.textures['sand1'], 63, 38, 1, 0, false);
        this.animations['sand2'] = new Animation('sand2', this.textures['sand2'], 63, 38, 1, 0, false);
        this.animations['sand3'] = new Animation('sand3', this.textures['sand3'], 63, 38, 1, 0, false);
        this.animations['sand4'] = new Animation('sand4', this.textures['sand4'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_ne'] = new Animation('sandgrassedge_ne', this.textures['sandgrassedge_ne'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_nw'] = new Animation('sandgrassedge_nw', this.textures['sandgrassedge_nw'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_se'] = new Animation('sandgrassedge_se', this.textures['sandgrassedge_se'], 63, 38, 1, 0, false);
        this.animations['sandgrassedge_sw'] = new Animation('sandgrassedge_sw', this.textures['sandgrassedge_sw'], 63, 38, 1, 0, false);
        this.animations['sandwateredge_ne'] = new Animation('sandwateredge_ne', this.textures['sandwateredge_ne'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_nw'] = new Animation('sandwateredge_nw', this.textures['sandwateredge_nw'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_se'] = new Animation('sandwateredge_se', this.textures['sandwateredge_se'], 63, 38, 2, 2000, true);
        this.animations['sandwateredge_sw'] = new Animation('sandwateredge_sw', this.textures['sandwateredge_sw'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_n'] = new Animation('sandwatercorner_n', this.textures['sandwatercorner_n'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_s'] = new Animation('sandwatercorner_s', this.textures['sandwatercorner_s'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_e'] = new Animation('sandwatercorner_e', this.textures['sandwatercorner_e'], 63, 38, 2, 2000, true);
        this.animations['sandwatercorner_w'] = new Animation('sandwatercorner_w', this.textures['sandwatercorner_w'], 63, 38, 2, 2000, true);
        this.animations['sandwaterwedge_e'] = new Animation('sandwaterwedge_e', this.textures['sandwaterwedge_e'], 63, 38, 2, 2000, true);
        this.animations['sandwaterwedge_w'] = new Animation('sandwaterwedge_w', this.textures['sandwaterwedge_w'], 63, 38, 2, 2000, true);
        this.animations['sandwaterwedge_n'] = new Animation('sandwaterwedge_n', this.textures['sandwaterwedge_n'], 63, 38, 2, 2000, true);
        this.animations['sandgrasscorner_w'] = new Animation('sandgrasscorner_w', this.textures['sandgrasscorner_w'], 63, 38, 1, 0, false);
        this.animations['sandgrasscorner_e'] = new Animation('sandgrasscorner_e', this.textures['sandgrasscorner_e'], 63, 38, 1, 0, false);
        this.animations['sandgrasscorner_n'] = new Animation('sandgrasscorner_n', this.textures['sandgrasscorner_n'], 63, 38, 1, 0, false);
        this.animations['sandgrasscorner_s'] = new Animation('sandgrasscorner_s', this.textures['sandgrasscorner_s'], 63, 38, 1, 0, false);
        this.animations['snow'] = new Animation('snow', this.textures['snow'], 63, 38, 1, 0, false);
        this.animations['bridge1'] = new Animation('bridge1', this.textures['bridge1'], 63, 38, 1, 0, false);

        //objects
        this.animations['ironfence_nw'] = new Animation('ironfence_nw', this.textures['ironfence_nw'], 63, 68, 1, 0, false);
        this.animations['ironfence_ne'] = new Animation('ironfence_ne', this.textures['ironfence_ne'], 63, 68, 1, 0, false);
        this.animations['rock1'] = new Animation('rock1', this.textures['rock1'], 49, 55, 1, 0, false);
        this.animations['rock2'] = new Animation('rock2', this.textures['rock2'], 48, 41, 1, 0, false);
        this.animations['fern1'] = new Animation('fern1', this.textures['fern1'], 16, 51, 1, 0, false);
        this.animations['fern2'] = new Animation('fern2', this.textures['fern2'], 60, 51, 1, 0, false);
        this.animations['fern3'] = new Animation('fern3', this.textures['fern3'], 36, 51, 1, 0, false);
        this.animations['streetlamp'] = new Animation('streetlamp', this.textures['streetlamp'], 16, 106, 1, 0, false);
        this.animations['wave1'] = new Animation('wave1', this.textures['wave1'], 166, 19, 4, 2000, true);
        this.animations['leaf1'] = new Animation('leaf1', this.textures['leaf1'], 56, 44, 1, 0, false);
        this.animations['leaf2'] = new Animation('leaf2', this.textures['leaf2'], 43, 31, 1, 0, false);
        this.animations['torch'] = new Animation('torch', this.textures['torch'], 10, 45, 2, 200, true);
        this.animations['stick1'] = new Animation('stick1', this.textures['stick1'], 85, 33, 1, 0, false);
        this.animations['stick2'] = new Animation('stick2', this.textures['stick2'], 68, 55, 1, 0, false);
        this.animations['rockwall_sw'] = new Animation('rockwall_sw', this.textures['rockwall_sw'], 62, 72, 1, 0, false);
        this.animations['rockwall_se'] = new Animation('rockwall_se', this.textures['rockwall_se'], 62, 72, 1, 0, false);
        this.animations['rockwalledge1_sw'] = new Animation('rockwalledge1_sw', this.textures['rockwalledge1_sw'], 62, 72, 1, 0, false);
        this.animations['rockwalledge2_sw'] = new Animation('rockwalledge2_sw', this.textures['rockwalledge2_sw'], 62, 72, 1, 0, false);
        this.animations['icestairs'] = new Animation('icestairs', this.textures['icestairs'], 89, 56, 1, 0, false);
        this.animations['mushroom'] = new Animation('mushroom', this.textures['mushroom'], 52, 52, 1, 0, false);
        this.animations['leaf3'] = new Animation('leaf3', this.textures['leaf3'], 52, 52, 1, 0, false);
        this.animations['blacksmithshouse'] = new Animation('blacksmithshouse', this.textures['blacksmithshouse'], 173, 111, 1, 0, false);
        this.animations['cardboardhouse1'] = new Animation('cardboardhouse1', this.textures['cardboardhouse1'], 131, 126, 1, 0, false);
        this.animations['cardboardhouse2'] = new Animation('cardboardhouse2', this.textures['cardboardhouse2'], 131, 126, 1, 0, false);
        this.animations['seashellhouse'] = new Animation('seashellhouse', this.textures['seashellhouse'], 141, 76, 1, 0, false);
        this.animations['snowman'] = new Animation('snowman', this.textures['snowman'], 41, 55, 1, 0, false);
        this.animations['chair'] = new Animation('chair', this.textures['chair'], 63, 62, 1, 0, false);
        this.animations['chair1'] = new Animation('chair1', this.textures['chair1'], 63, 62, 1, 0, false);
        this.animations['table'] = new Animation('table', this.textures['table'], 53, 43, 1, 0, false);
        this.animations['cabinwall_nw'] = new Animation('cabinwall_nw', this.textures['cabinwall_nw'], 63, 68, 1, 0, false);
        this.animations['cabinwall_ne'] = new Animation('cabinwall_ne', this.textures['cabinwall_ne'], 63, 68, 1, 0, false);
        this.animations['cabinwallcorner'] = new Animation('cabinwallcorner', this.textures['cabinwallcorner'], 63, 68, 1, 0, false);
        this.animations['boothouse'] = new Animation('boothouse', this.textures['boothouse'], 145, 159, 1, 0, false);

        //actors
        this.animations['player'] = new Animation('player', this.textures['player'], 35, 45, 4, 400, true);
        this.animations['playerLeftMove'] = new Animation('playerLeftMove', this.textures['playerLeftMove'], 60, 35, 2, 200, true);
        this.animations['playerRightMove'] = new Animation('playerRightMove', this.textures['playerRightMove'], 60, 35, 2, 200, true);
        this.animations['tater'] = new Animation('tater', this.textures['tater'], 28, 26, 1, 0, false);
        this.animations['taterLeftMove'] = new Animation('taterLeftMove', this.textures['taterLeftMove'], 43, 20, 4, 100, true);
        this.animations['taterRightMove'] = new Animation('taterRightMove', this.textures['taterRightMove'], 43, 20, 4, 100, true);
        this.animations['beeLeftMove'] = new Animation('beeLeftMove', this.textures['beeLeftMove'], 32, 56, 2, 100, true);
        this.animations['beeRightMove'] = new Animation('beeRightMove', this.textures['beeRightMove'], 32, 56, 2, 100, true);
        this.animations['snailshell'] = new Animation('snailshell', this.textures['item_snailshell'], 31, 27, 1, 0, false);
        this.animations['emerald'] = new Animation('emerald', this.textures['item_emerald'], 30, 30, 1, 0, false);
        this.animations['waterbucket'] = new Animation('waterbucket', this.textures['item_waterbucket'], 20, 20, 1, 0, false);
        this.animations['signpost'] = new Animation('signpost', this.textures['signpost'], 25, 54, 1, 0, false);
        this.animations['lauren'] = new Animation('lauren', this.textures['lauren'], 41, 50, 4, 400, true);
        this.animations['amy'] = new Animation('amy', this.textures['amy'], 70, 85, 3, 500, true);
        this.animations['thomas'] = new Animation('thomas', this.textures['thomas'], 35, 45, 4, 500, true);
        this.animations['arnold'] = new Animation('arnold', this.textures['arnold'], 43, 62, 3, 500, true);
        this.animations['bogart'] = new Animation('bogart', this.textures['bogart'], 68, 58, 4, 500, true);
        this.animations['oscar'] = new Animation('oscar', this.textures['oscar'], 82, 50, 4, 500, true);
        this.animations['fireplacecold'] = new Animation('fireplacecold', this.textures['fireplacecold'], 63, 86, 1, 0, false);
        this.animations['fireplacewarm'] = new Animation('fireplacewarm', this.textures['fireplacewarm'], 63, 86, 2, 200, true);
        this.animations['dockhouse'] = new Animation('dockhouse', this.textures['dockhouse'], 135, 162, 4, 500, true);
        this.animations['doorway'] = new Animation('doorway', this.textures['doorway'], 63, 59, 1, 0, false);
        this.animations['glassbottle'] = new Animation('glassbottle', this.textures['glassbottle'], 187, 129, 1, 0, false);
        this.animations['spring'] = new Animation('spring', this.textures['spring'], 187, 129, 2, 1000, true);
        this.animations['rudyLeftMove'] = new Animation('rudyLeftMove', this.textures['rudyLeftMove'], 49, 34, 2, 300, true);
        this.animations['rudyRightMove'] = new Animation('rudyRightMove', this.textures['rudyRightMove'], 49, 34, 2, 300, true);
        this.animations['blue'] = new Animation('blue', this.textures['blue'], 76, 65, 4, 700, true);
        this.animations['dusty'] = new Animation('dusty', this.textures['dusty'], 94, 56, 2, 1000, true);

        Object.keys(this.animations).forEach(key => { this.animations[key].start(); });
    }

    loadTiles() {
        this.tiles = {};
        this.tiles['empty'] = new Tile("Empty", this.animations['empty'], true);
        this.tiles['grass'] = new Tile("Grass", this.animations['grass'], true);
        this.tiles['grassflowers'] = new Tile("GrassFlowers", this.animations['grassflowers'], true);
        this.tiles['asphalt'] = new Tile("Asphalt", this.animations['asphalt'], true);
        this.tiles['sidewalk1'] = new Tile("Sidewalk1", this.animations['sidewalk1'], true);
        this.tiles['sidewalk2'] = new Tile("Sidewalk2", this.animations['sidewalk2'], true);
        this.tiles['sidewalk3'] = new Tile("Sidewalk3", this.animations['sidewalk3'], true);
        this.tiles['stone'] = new Tile("Stone", this.animations['stone'], true);
        this.tiles['stone1'] = new Tile("Stone1", this.animations['stone1'], true);
        this.tiles['water1'] = new Tile("Water1", this.animations['water1'], true);
        this.tiles['waterbubble'] = new Tile("WaterBubble", this.animations['waterbubble'], true);
        this.tiles['mud1'] = new Tile("Mud1", this.animations['mud1'], true);
        this.tiles['mud2'] = new Tile("Mud2", this.animations['mud2'], true);
        this.tiles['sand1'] = new Tile("Sand1", this.animations['sand1'], true);
        this.tiles['sand2'] = new Tile("Sand2", this.animations['sand2'], true);
        this.tiles['sand3'] = new Tile("Sand3", this.animations['sand3'], true);
        this.tiles['sand4'] = new Tile("Sand4", this.animations['sand4'], true);
        this.tiles['sandgrassedge_ne'] = new Tile("SandGrassEdge_NE", this.animations['sandgrassedge_ne'], true);
        this.tiles['sandgrassedge_se'] = new Tile("SandGrassEdge_SE", this.animations['sandgrassedge_se'], true);
        this.tiles['sandgrassedge_nw'] = new Tile("SandGrassEdge_NW", this.animations['sandgrassedge_nw'], true);
        this.tiles['sandgrassedge_sw'] = new Tile("SandGrassEdge_SW", this.animations['sandgrassedge_sw'], true);
        this.tiles['sandwateredge_ne'] = new Tile("SandWaterEdge_NE", this.animations['sandwateredge_ne'], true);
        this.tiles['sandwateredge_se'] = new Tile("SandWaterEdge_SE", this.animations['sandwateredge_se'], true);
        this.tiles['sandwateredge_nw'] = new Tile("SandWaterEdge_NW", this.animations['sandwateredge_nw'], true);
        this.tiles['sandwateredge_sw'] = new Tile("SandWaterEdge_SW", this.animations['sandwateredge_sw'], true);
        this.tiles['sandwatercorner_n'] = new Tile("SandWaterCorner_N", this.animations['sandwatercorner_n'], true);
        this.tiles['sandwatercorner_s'] = new Tile("SandWaterCorner_S", this.animations['sandwatercorner_s'], true);
        this.tiles['sandwatercorner_w'] = new Tile("SandWaterCorner_W", this.animations['sandwatercorner_w'], true);
        this.tiles['sandwatercorner_e'] = new Tile("SandWaterCorner_E", this.animations['sandwatercorner_e'], true);
        this.tiles['sandwaterwedge_w'] = new Tile("SandWaterWedge_W", this.animations['sandwaterwedge_w'], true);
        this.tiles['sandwaterwedge_e'] = new Tile("SandWaterWedge_E", this.animations['sandwaterwedge_e'], true);
        this.tiles['sandwaterwedge_n'] = new Tile("SandWaterWedge_N", this.animations['sandwaterwedge_n'], true);
        this.tiles['sandgrasscorner_n'] = new Tile("SandGrassCorner_N", this.animations['sandgrasscorner_n'], true);
        this.tiles['sandgrasscorner_s'] = new Tile("SandGrassCorner_S", this.animations['sandgrasscorner_s'], true);
        this.tiles['sandgrasscorner_e'] = new Tile("SandGrassCorner_E", this.animations['sandgrasscorner_e'], true);
        this.tiles['sandgrasscorner_w'] = new Tile("SandGrassCorner_W", this.animations['sandgrasscorner_w'], true);
        this.tiles['snow'] = new Tile("Snow", this.animations['snow'], true);
        this.tiles['bridge1'] = new Tile("Bridge1", this.animations['bridge1'], true);
        this.tiles['rug1'] = new Tile("Rug1", this.animations['rug1'], true);
        this.tiles['rug2'] = new Tile("Rug2", this.animations['rug2'], true);
    }

    loadLevelObjects() {
        this.levelObjects = {};
        this.levelObjects['ironfence_nw'] = new LevelObject("IronFence_NW", this.animations['ironfence_nw']);
        this.levelObjects['ironfence_ne'] = new LevelObject("IronFence_NE", this.animations['ironfence_ne']);
        this.levelObjects['rock1'] = new LevelObject("Rock1", this.animations['rock1']);
        this.levelObjects['rock2'] = new LevelObject("Rock2", this.animations['rock2']);
        this.levelObjects['wave1'] = new LevelObject("Wave1", this.animations['wave1']);
        this.levelObjects['fern1'] = new LevelObject("Fern1", this.animations['fern1']);
        this.levelObjects['fern2'] = new LevelObject("Fern2", this.animations['fern2']);
        this.levelObjects['fern3'] = new LevelObject("Fern3", this.animations['fern3']);
        this.levelObjects['streetlamp'] = new LevelObject("StreetLamp", this.animations['streetlamp']);
        this.levelObjects['leaf1'] = new LevelObject("Leaf1", this.animations['leaf1']);
        this.levelObjects['leaf2'] = new LevelObject("Leaf2", this.animations['leaf2']);
        this.levelObjects['leaf3'] = new LevelObject("Leaf3", this.animations['leaf3']);
        this.levelObjects['torch'] = new LevelObject("Torch", this.animations['torch']);
        this.levelObjects['stick1'] = new LevelObject("Stick1", this.animations['stick1']);
        this.levelObjects['stick2'] = new LevelObject("Stick2", this.animations['stick2']);
        this.levelObjects['rockwall_sw'] = new LevelObject("RockWall_SW", this.animations['rockwall_sw']);
        this.levelObjects['rockwall_se'] = new LevelObject("RockWall_SE", this.animations['rockwall_se']);
        this.levelObjects['rockwalledge1_sw'] = new LevelObject("RockWallEdge1_SW", this.animations['rockwalledge1_sw']);
        this.levelObjects['rockwalledge2_sw'] = new LevelObject("RockWallEdge2_SW", this.animations['rockwalledge2_sw']);
        this.levelObjects['seashellhouse'] = new LevelObject("SeaShellHouse", this.animations['seashellhouse']);
        this.levelObjects['cardboardhouse1'] = new LevelObject("CardboardHouse1", this.animations['cardboardhouse1']);
        this.levelObjects['cardboardhouse2'] = new LevelObject("CardboardHouse2", this.animations['cardboardhouse2']);
        this.levelObjects['blacksmithshouse'] = new LevelObject("BlacksmithsHouse", this.animations['blacksmithshouse']);
        this.levelObjects['icestairs'] = new LevelObject("Icestairs", this.animations['icestairs']);
        this.levelObjects['mushroom'] = new LevelObject("Mushroom", this.animations['mushroom']);
        this.levelObjects['chair'] = new LevelObject("Chair", this.animations['chair']);
        this.levelObjects['chair1'] = new LevelObject("Chair1", this.animations['chair1']);
        this.levelObjects['table'] = new LevelObject("Table", this.animations['table']);
        this.levelObjects['cabinwall_nw'] = new LevelObject("CabinWall_NW", this.animations['cabinwall_nw']);
        this.levelObjects['cabinwall_ne'] = new LevelObject("CabinWall_NE", this.animations['cabinwall_ne']);
        this.levelObjects['cabinwallcorner'] = new LevelObject("CabinWallCorner", this.animations['cabinwallcorner']);
        this.levelObjects['boothouse'] = new LevelObject("BootHouse", this.animations['boothouse']);
        this.levelObjects['snowman'] = new LevelObject("Snowman", this.animations['snowman']);
    }
}