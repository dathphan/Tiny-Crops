class Title extends Phaser.Scene { //this is the title screen
    constructor(){
        super("title");
    }

    create(){ 
        this.TILESIZE = 16;
        this.SCALE = 2.0;
        this.TILEWIDTH = 40;
        this.TILEHEIGHT = 25;

        this.cameras.main.setZoom(2.0);
        this.map = this.add.tilemap("farm-tilemap", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);


        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenney-tiny-town", "world-tileset");
        this.npcInteraction = this.map.getObjectLayer("NPCs");

        // Create the layers
        this.soilLayer = this.map.createLayer("Soil", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.hillsLayer = this.map.createLayer("Hills", this.tileset, 0, 0);
        this.plantLayer = this.map.createLayer("Plants", [this.tileset, this.tileset2], 0, 0);

        this.add.rectangle(300, 200, 800, 400, "0x000000", 0.5);
        this.titleText();
    }

    titleText() {
        this.add.text(300, 75, "Little Crops",{  //title
            fontFamily: 'Silkscreen',
            color: '#78a158',
            fontSize: 48
        }).setOrigin(0.5);

        this.Start = this.add.text(300, 275, "START",{ //start button
            fontFamily: 'Silkscreen',
            color: '#d2e077',
            fontSize: 24,
        }).setOrigin(0.5);
        
        this.Credits = this.add.text(300, 325, "CREDITS/CONTROLS",{ //credits button
            fontFamily: 'Silkscreen',
            color: '#8cbfc2',
            fontSize: 24,
        }).setOrigin(0.5);

        this.Start.setInteractive({useHandCursor: true}); //Makes Start interactable so that pointerdown arrow function works.
        this.Credits.setInteractive({useHandCursor: true});
        
        this.Start.on("pointerdown", () => {//starts the game when pressed.
            this.scene.start("main");
        });

        this.Credits.on("pointerdown", () => {//opens the credits when pressed
            this.CreditBackground = this.add.rectangle(300, 200, 800, 400, "0x000000", 0.75); 
            this.CreditBackground.setInteractive({useHandCursor: true}); 
            this.CreditText = this.add.text(50, 50, "CREDITS:\nMade by Damon Phan and James Chen\nMade for CMPM 120\nMade in Phaser, using \n\nArt assets by cupnoodle: Sprout Lands.\nSounds by Shapeforms, Tallbeard Studios, and Obsydianx\n\nTo play, use WASD or the arrow keys to move and space to interact with the ground, NPCs, or the house. Buy seeds on the left, plant the in the middle, sell them on the right, and upgrade your house on the top.\n\n\n                          *click to exit*",{ 
                fontFamily: 'Silkscreen',
                fontSize: 16,
                wordWrap: { 
                    width: 500
                }
            });
            this.CreditBackground.on("pointerdown", () => { //removes the credits screen.
                this.CreditBackground.destroy();
                this.CreditText.destroy();
            });
        });
    }
}