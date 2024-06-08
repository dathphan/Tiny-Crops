class Tilemap extends Phaser.Scene {
    constructor() {
        super("tilemap");
    }

    preload() {
        this.load.setPath("./assets/");

        // Load tilemap information
        this.load.image("world-tileset", "small-crops-tiles.png");          // Packed tilemap
        this.load.tilemapTiledJSON("farm-tilemap", "farm-tilemap.tmj");     // Tilemap in JSON
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 2.0;
        this.TILEWIDTH = 40;
        this.TILEHEIGHT = 25;
    }

    create() {
        this.createMap();
        this.setCamera();
    }

    setCamera() {
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);
    }

    createMap() {
        this.map = this.add.tilemap("farm-tilemap", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenney-tiny-town", "world-tileset");

        // Create the layers
        this.soilLayer = this.map.createLayer("Soil", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.hillsLayer = this.map.createLayer("Hills", this.tileset, 0, 0);
        this.plantLayer = this.map.createLayer("Plants", this.tileset, 0, 0);
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}