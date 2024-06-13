class Load extends Phaser.Scene { //May be redundant
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");
        // Player Movemment
        this.load.spritesheet({
            key: 'player',
            url: 'Characters/Premium Charakter Spritesheet.png',
            frameConfig: {
                frameWidth: 48,
                frameHeight: 48,
            }
        });

        // Tilemap Information
        this.load.image("world-tileset", "small-crops-tiles.png");          // Packed tilemap
        this.load.image("signs-tileset", "Objects/signs.png");
        this.load.tilemapTiledJSON("farm-tilemap", "farm-tilemap.tmj");     // Tilemap in JSON

        // NPC Information
        this.load.image("buyer", "blue_townie.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.image("seller", "purple_townie.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet({
            key: 'bubble',
            url: 'speech_bubbles.png',
            frameConfig: {
                frameWidth: 64,
                frameHeight: 32,
            }
        });

        //Crops
        this.load.spritesheet({
            key: "crops",
            url: "Objects/Farming Plants.png",
            frameConfig: {
                frameHeight: 16,
                frameWidth: 16
            }
        })
    }

    create() {

        // ...and pass to the next Scene
        this.scene.start("title");
    }

}