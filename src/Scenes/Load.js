class Load extends Phaser.Scene { //May be redundant
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

//OLD CODE TO BE DELETED FROM HERE...
        // Load townsfolk
        this.load.image("purple", "purple_townie.png");
        this.load.image("blue", "blue_townie.png");

        // Load tilemap information
        this.load.image("tilemap_tiles", "tilemap_packed.png");                   // Packed tilemap
        // this.load.tilemapTiledJSON("three-farmhouses", "three-farmhouses.tmj");   // Tilemap in JSON
//...TO HERE.
    }

    create() {

        // ...and pass to the next Scene
        this.scene.start("main");
    }

}