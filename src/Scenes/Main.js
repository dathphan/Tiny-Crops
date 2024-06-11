class Main extends Phaser.Scene {
    constructor() {
        super("main");
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
    }

    init() {
        //Tilemap Constants
        this.TILESIZE = 16;
        this.SCALE = 2.0;
        this.TILEWIDTH = 40;
        this.TILEHEIGHT = 25;

        //Player Constants
        this.PLAYERSPEED = 75;
        this.direction = "down";
    }

    create() {
        // Tilemap Setup
        this.createMap();
        this.setCamera();

        // Player Setup
        this.createAnimations();
        this.initalizeInputs();
        
        this.createPlayer();

        //Debug
        this.input.keyboard.on('keydown-F1', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        // TEMP THIS IS TO TEST FARM UPGRADES
        this.upgradeFarm(1)
        this.upgradeFarm(2)
        this.children.bringToTop(my.sprite.player);

        //Keeps track of score for buying and selling.
        this.money = 10
        this.moneycheck = this.add.text(10,10, "Money: " + this.money);

        //keeps track of the crops planted.
        this.currentCrops = [];

        //For keeping track of what plants and seeds you have + number of house upgrades.
        this.carrot = 0;
        this.tomato = 0;
        this.bluestar = 0;
        this.carrotseed = 5;
        this.tomatoseed = 0;
        this.bluestarseed = 0;

        this.upgrades = 0;
    }

    update() {
        this.updatePlayerMovement();
        this.updatePlayerAnimations();
        if(Phaser.Input.Keyboard.JustDown(this.interact)){
            this.checkForInteraction();
            this.moneyChecker();
        }
        this.cropTick();
    }

    setCamera() {//Camera Setup
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.setZoom(this.SCALE);
    }

    createMap() {//Creates map based on Tilemap
        this.map = this.add.tilemap("farm-tilemap", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        // Add a tileset to the map
        this.tileset = this.map.addTilesetImage("kenney-tiny-town", "world-tileset");
        this.tileset2 = this.map.addTilesetImage("signs", "signs-tileset");
        this.npcInteraction = this.map.getObjectLayer("NPCs");

        // Create the layers
        this.soilLayer = this.map.createLayer("Soil", this.tileset, 0, 0);
        this.grassLayer = this.map.createLayer("Grass", this.tileset, 0, 0);
        this.hillsLayer = this.map.createLayer("Hills", this.tileset, 0, 0);
        this.plantLayer = this.map.createLayer("Plants", [this.tileset, this.tileset2], 0, 0);
        // this.houseLayer = this.map.createLayer("House", this.tileset, 0, 0);
        
        // Create the object layers.
        this.Buyers = this.map.createFromObjects("NPCs", {
            name: "Buyer",
            key: "buyer",
            gid: 1
        }, true);

        this.Sellers = this.map.createFromObjects("NPCs", {
            name: "Seller",
            key: "seller",
            gid: 1
        }, true); 

        //Collision Properties
        this.hillsLayer.setCollisionByProperty({ collides: true });
        this.plantLayer.setCollisionByProperty({ collides: "true" });
        // this.houseLayer.setCollisionByProperty({ collides: true });
    }

    createPlayer() {
        // Setting up Player
        my.sprite.player = this.physics.add.sprite(this.TILESIZE * this.TILEWIDTH / 2, this.TILESIZE * this.TILEHEIGHT / 2, 'player');
        my.sprite.player.body.setSize(12, 8);
        my.sprite.player.body.setOffset(18, 24);
        my.sprite.player.play('idle_left');
        my.sprite.player.setCollideWorldBounds(true);

        //Player Collision Setup
        this.physics.add.collider(my.sprite.player, this.hillsLayer);
        this.physics.add.collider(my.sprite.player, this.plantLayer);
        this.physics.add.collider(my.sprite.player, this.houseLayer);
    }

    createAnimations() {//Player walking and idle animations
        let framerate = 12

        this.anims.create({
            key: 'idle_down',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(0)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle_up',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(1)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle_left',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(2)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'idle_right',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(3)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_down',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(4)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_up',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(5)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_right',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(6)),
            frameRate: framerate,
            repeat: -1
        });

        this.anims.create({
            key: 'walk_left',
            frames: this.anims.generateFrameNumbers('player', this.frameStartEnd(7)),
            frameRate: framerate,
            repeat: -1
        });
    }

    frameStartEnd(index) {
        return {start: index * 8, end: index * 8 + 7 }
    }

    initalizeInputs() {//Player Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.interact = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
    }

    updatePlayerMovement() {//Player movement and direction
        my.sprite.player.setVelocity(0);
        
        let up = (this.cursors.up.isDown || this.wasd.up.isDown) ? 1 : 0;
        let down = (this.cursors.down.isDown || this.wasd.down.isDown) ? 1 : 0;
        
        let left = (this.cursors.left.isDown || this.wasd.left.isDown) ? 1 : 0;
        let right = (this.cursors.right.isDown || this.wasd.right.isDown) ? 1 : 0;

        my.sprite.player.setVelocityY(this.PLAYERSPEED * (down - up));
        my.sprite.player.setVelocityX(this.PLAYERSPEED * (right - left));
        //could add walking SFX or particles if have time
    }

    updatePlayerAnimations() {//Player animations checker

        let player = my.sprite.player
        let dir;
        let isWalking = true;
        if (player.body.velocity.x > 0) {
            dir = "right";
        } 
        else if (player.body.velocity.x < 0) {
            dir = "left";
        } 
        else if (player.body.velocity.y < 0) {
            dir = "up"
        } 
        else if (player.body.velocity.y > 0) {
            dir = "down"
        }
        else {
            dir = this.direction;
            isWalking = false;
        }

        let animation = (isWalking ? "walk_" : "idle_") + dir
        if (player.anims.currentAnim.key != animation) {
            player.play(animation);
        }
        this.direction = dir
    }

    checkForInteraction() {//if the interact key (space key) is pressed, check for conditions that affect 
        let player = my.sprite.player
        //reduce search time through seperating the crops, NPCs, and upgrade options. This is due to the y values being in seperate zones.
        if((70 <= player.body.y && player.body.y <= 140) && (288 <= player.body.x && player.body.x <= 356)){ //checks if player is in the upgrade section
            switch(this.upgrades){//check if can upgrade
                case(0):
                    if(this.money >= 8){//prevent possible softlock by having the player always have at least one money to buy seeds.
                        this.money -= 7;
                        this.upgrades = 1;
                        console.log("purchase sfx");
                        //update map
                    }
                    break;
                case(1):
                    if(this.money >= 17){
                        this.money -= 16;
                        this.upgrades = 2;
                        console.log("purchase sfx");
                        //update map
                    }
                    break;
                case(2):
                    if(this.money >= 28){
                        this.money -= 27;
                        this.upgrades = 3;
                        console.log("purchase sfx");
                        //update map
                    }
                    break;
                case(3):
                    win();
                default:    
                    console.log("no money sfx");
            }
        }
        else if(176 <= player.body.y && player.body.y < 210) { //check if near NPCS
            if(70 <= player.body.x && player.body.x <= 90){//CarrotSeed selling NPC
                if(this.money > 0){
                    this.carrotseed += 1;
                    this.money -= 1;
                    console.log("purchase sfx");
                }
                else{
                    console.log("no money sfx");
                }
            }
            if(105 <= player.body.x && player.body.x <= 125){//TomatoSeed selling NPC
                if(this.money > 1){
                    this.tomatoseed += 1;
                    this.money -= 2;
                    console.log("purchase sfx");
                }
                else{
                    console.log("no money sfx");                    
                }
            }
            if(140 <= player.body.x && player.body.x <= 155){//BlueStarFruitSeed selling NPC
                if(this.money > 3){
                    this.bluestarseed += 1;
                    this.money -= 4;
                    console.log("purchase sfx");
                }
                else{
                    console.log("no money sfx");                    
                }
            }
            if(505 <= player.body.x && player.body.x <= 525){//Carrot buying NPC
                if(this.carrot > 1){
                    this.money += 2;
                    this.carrot -= 1;
                    console.log("money.sfx");
                }
                else{
                    console.log("no carrot sfx");
                }
            }
            if(535 <= player.body.x && player.body.x <= 555){//Tomato buying NPC
                if(this.tomato > 1){
                    this.money += 4;
                    this.tomato -= 1;
                    console.log("money.sfx");
                }
                else{
                    console.log("no tomato sfx");
                }
            }
            if(570 <= player.body.x && player.body.x <= 580){//BlueStarFruit buying NPC
                if(this.bluestar > 1){
                    this.money += 8;
                    this.bluestar -= 1;
                    console.log("money.sfx");
                }
                else{
                    console.log("no blue star fruit sfx");
                }
            }
        }
        else if (player.body.y > 220){//check if near crops
            if(110 <= player.body.x && player.body.x <= 215 && 235 <= player.body.y && player.body.y <= 315) {
                console.log("crops1");
            }
            if(270 <= player.body.x && player.body.x <= 375 && 250 <= player.body.y && player.body.y <=330) {
                console.log("crops2");
            }
            if(430 <= player.body.x && player.body.x <= 505 && 235 <= player.body.y && player.body.y <= 315) {
                console.log("crops3");
            }

        }
        else{}//nothing happens if not on these tiles.
        /*
        if(above crop && crop ready){
            this.carrot += 1;
            removeCurrentCrop(crop);
            sfx
            update map
        }
        else if(above crop && crop not ready){
            sfx    
        }

        if(above dirt && has seeds){
            this.carrotSeed -= 1;
            this.currentCrops.push(crop);
            sfx
            update map
        }
        else if(above dirt && no seeds){
            sfx
        }
        */
    }

    moneyChecker(){ //Keeps track of the money that you have left. 
        this.moneycheck.destroy();
        this.moneycheck = this.add.text(10, 10, "Money: " + this.money);
    }

    cropTick(){ //Keeps track of crop and their growth time.
        /*
        for(let i = 0; i < this.currentCrops.length();i++){
            if(this.currentCrops[i].grown == false){
                this.currentCrops[i].time += 1;
                if(this.currentCrops[i].time >= this.currentCrops[i].max) {
                    this.currentCrops[i].grown = true;
                }
            }
        }*/
    }

    win() {
        this.scene.start("ending");
    }

    upgradeFarm(upgradeIndex) {
        switch (upgradeIndex) {
            case 1:
                let upgrade1 = this.map.createLayer("Upgrade-1", this.tileset, 0, 0);
                upgrade1.setCollisionByProperty({ collides: true });
                this.physics.add.collider(my.sprite.player, upgrade1);
                break;
            case 2:
                let upgrade21 = this.map.createLayer("Upgrade-2-1", this.tileset, 0, 0);
                let upgrade22 = this.map.createLayer("Upgrade-2-2", this.tileset, 0, 0);
                upgrade21.setCollisionByProperty({ collides: true });
                upgrade22.setCollisionByProperty({ collides: true });
                this.physics.add.collider(my.sprite.player, upgrade21);
                this.physics.add.collider(my.sprite.player, upgrade22);
                break;
            case 3:
                let upgrade3 = this.map.createLayer("Upgrade-3-1", this.tileset, 0, 0);
                upgrade3.setCollisionByProperty({ collides: true });
                this.physics.add.collider(my.sprite.player, upgrade3);
                break;
        }
    }
}
