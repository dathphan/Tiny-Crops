class Main extends Phaser.Scene {
    constructor() {
        super("main");
    }

    win() {
        this.sound.stopAll();
        this.scene.start("end");
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
        this.createBubbles();

        // Player Setup
        this.createAnimations();
        this.initalizeInputs();
        this.createPlayer();

        //Debug
        this.input.keyboard.on('keydown-F1', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);
        this.physics.world.drawDebug = false;

        //Keeps track of score for buying and selling.
        this.money = 10; 
        this.carrot = 0;
        this.tomato = 0;
        this.bluestar = 0;
        this.carrotseed = 5;
        this.tomatoseed = 0;
        this.bluestarseed = 0;

        this.add.image(32, 163, "inventory"); 
        this.inventory = this.add.text(32, 100, `${this.money}\n${this.carrotseed}\n${this.tomatoseed}\n${this.bluestarseed}\n${this.carrot}\n${this.tomato}\n${this.bluestar}`, {
            fontFamily: 'Silkscreen',
            fontSize: '16px',
            lineSpacing: -0.5
        }); 

        //keeps track of the crops planted.
        this.currentCrops = [];

        //For keeping track of what plants and seeds you have + number of house upgrades.
        this.carrot = 0;
        this.tomato = 0;
        this.bluestar = 0;
        this.carrotseed = 5;
        this.tomatoseed = 0;
        this.bluestarseed = 0;
        this.upgrades= 1;

        this.createAudio()
    }

    update() {
        this.updatePlayerMovement();
        this.updatePlayerAnimations();
        this.cropTick();
        this.NPCbubble()
        if(Phaser.Input.Keyboard.JustDown(this.interact)){
            this.checkForInteraction();
            this.updateInventory();
        }
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
    }

    createBubbles() {
        this.bubbles = [];
        this.bubbles.push(this.add.sprite(110, 145, 'bubble', 0));
        this.bubbles.push(this.add.sprite(142, 145, 'bubble', 1));
        this.bubbles.push(this.add.sprite(174, 145, 'bubble', 2));
        this.bubbles.push(this.add.sprite(542, 145, 'bubble', 3));
        this.bubbles.push(this.add.sprite(574, 145, 'bubble', 4));
        this.bubbles.push(this.add.sprite(606, 145, 'bubble', 5));
        this.hideBubbles();
    }

    hideBubbles() {
        this.bubbles.forEach(bub => {
            bub.setVisible(false);
        });
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

    frameStartEnd(index) { //declares the start and end of a frame.
        return {start: index * 8, end: index * 8 + 7 }
    }

    createAudio() {
        this.sfxPick = this.sound.add('pick', {volume: 0.8});
        this.sfxError = this.sound.add('error', {volume: 0.2});
        this.sfxUpgrade = this.sound.add('upgrade', {volume: 0.8});
        this.sfxSell = this.sound.add('sell', {volume: 0.8});
        this.sfxPlant = this.sound.add('plant', {volume: 0.6});
        this.sfxPurchase = this.sound.add('purchase', {volume: 0.8});

        this.sound.add('background-music', { loop: true }).play();
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

    checkForInteraction() {//if the interact key (space key) is pressed, check what the player is interacting with
        let player = my.sprite.player

        //reduce search time through seperating the crops, NPCs, and upgrade options. This is due to the y values being in seperate zones.
        if((70 <= player.body.y && player.body.y <= 140) && (288 <= player.body.x && player.body.x <= 356)){ //checks if player is in the upgrade section
            this.upgradeFarm(this.upgrades);
            this.children.bringToTop(my.sprite.player);
        }

        else if(176 <= player.body.y && player.body.y < 210) { //check if near NPCS
            this.NPCtalk(player.body.x);
        }

        else if (player.body.y > 220){//check if near crops
            if(112 < player.body.x && player.body.x < 224 && 240 < player.body.y && player.body.y < 320) {//carrot field
                this.cropCheck(1);
            }
            else if(272 < player.body.x && player.body.x < 384 && 256 < player.body.y && player.body.y < 336) {//tomato field
                this.cropCheck(2);
            }
            else if(432 < player.body.x && player.body.x < 544 && 240 < player.body.y && player.body.y <  320) {//blue star field
                this.cropCheck(3);
            }
        }
    }

    updateInventory() {
        this.inventory.setText(`${this.money}\n${this.carrotseed}\n${this.tomatoseed}\n${this.bluestarseed}\n${this.carrot}\n${this.tomato}\n${this.bluestar}`);
    }

    cropTick(){ //Keeps track of crop and their growth time.
        for(let i = 0; i < this.currentCrops.length;i++){
            if(this.currentCrops[i].grown == false){//prevents unessecary checking
                this.currentCrops[i].time += 1;
                if(this.currentCrops[i].time >= this.currentCrops[i].max) { //grows to final frame and can be collected.
                    this.currentCrops[i].grown = true;
                    this.currentCrops[i].framenum += 1;
                    this.currentCrops[i].setTexture("crops", this.currentCrops[i].framenum);
                }
                else if(this.currentCrops[i].time >= this.currentCrops[i].max / 2 && !this.currentCrops[i].thirdframe) { //used for growing to 3rd frame 
                    this.currentCrops[i].framenum += 1;
                    this.currentCrops[i].setTexture("crops", this.currentCrops[i].framenum );
                    this.currentCrops[i].thirdframe = true;
                }
                else if(this.currentCrops[i].time >= this.currentCrops[i].max / 4 && !this.currentCrops[i].secondframe) { //used for growing to 2nd frame
                    this.currentCrops[i].framenum += 1;
                    this.currentCrops[i].setTexture("crops", this.currentCrops[i].framenum);
                    this.currentCrops[i].secondframe = true;
                }
            }
        }
    }

    tileLocation(){//Returns the approximate tile location the player is on. Useful for crop locations.
        let player = my.sprite.player
        let tempx = Math.floor(player.body.x) - (Math.floor(player.body.x) % 16);
        let tempy = Math.floor(player.body.y) - (Math.floor(player.body.y) % 16);
        return [tempx, tempy];
    }

    cropCheck(FieldNum){ //checks if the current tile is empty or not, and either allows a crop be to planted or picked up.
        let Searcher = this.tileLocation();
        let isEmpty = true;
        for(let i = 0; i < this.currentCrops.length;i++){
            if(Searcher[0] == this.currentCrops[i].x-8){    
                if(Searcher[1] == this.currentCrops[i].y-8){
                    isEmpty = false;
                    var index = i;
                    break;
                }
            }
        }
        if(isEmpty){
            this.cropPlant(Searcher, FieldNum);
        }
        else{
            this.cropCollect(FieldNum, index); 
        }
    }

    cropPlant(Searcher, FieldNum){//plants a crop on the tile only if you have the seeds for it.
        if(FieldNum == 1 && this.carrotseed > 0){
            this.carrotseed -= 1; 
            this.cropInit(Searcher[0], Searcher[1], 0, 360, false, FieldNum);
            this.sfxPlant.play();
        }
        else if(FieldNum == 2 && this.tomatoseed > 0){
            this.tomatoseed -= 1;
            this.cropInit(Searcher[0], Searcher[1], 0, 360, false, FieldNum);
            this.sfxPlant.play();
        }
        else if(FieldNum == 3 && this.bluestarseed > 0){
            this.bluestarseed -= 1;
            this.cropInit(Searcher[0], Searcher[1], 0, 360, false, FieldNum);
            this.sfxPlant.play();
        }
        else{
            this.sfxError.play();
        }
    }

    cropInit(x, y, time, max, grown, FieldNum) {//creates a crop and puts it in currentCrops
        if(FieldNum == 1){
            var crop = this.add.image(x+8, y+8, "crops", 10);  //x+8 fits the center better 
        }
        if(FieldNum == 2){
            var crop = this.add.image(x+8, y+8, "crops", 20);
        }
        if(FieldNum == 3){
            var crop = this.add.image(x+8, y+8, "crops", 65);
        }
        crop.time = time;
        crop.max = max;
        crop.grown = grown;
        crop.FieldNum = FieldNum;
        crop.framenum = FieldNum * 10; 
        crop.secondframe = false; 
        crop.thirdframe = false;
        if(FieldNum == 3){
            crop.framenum = 65;
        }
        this.currentCrops.push(crop);
        this.children.bringToTop(my.sprite.player);
    }

    cropCollect(FieldNum, index){//collects the crop and delete the crop.
        if(FieldNum == 1 && this.currentCrops[index].grown){ 
            this.carrot += 1;
            this.currentCrops[index].destroy();
            this.currentCrops.splice(index, 1);
            this.sfxPick.play();
        }
        else if(FieldNum == 2 && this.currentCrops[index].grown){
            this.tomato += 1;
            this.currentCrops[index].destroy();
            this.currentCrops.splice(index, 1);
            this.sfxPick.play();
        }
        else if(FieldNum == 3 && this.currentCrops[index].grown){ 
            this.bluestar += 1;
            this.currentCrops[index].destroy();
            this.currentCrops.splice(index, 1);
            this.sfxPick.play();
        }
        else{
            this.sfxError.play();
        }
    }

    upgradeFarm(upgradeIndex) { //Upgrades the farm if you have money.
        switch (upgradeIndex) {
            case 1://Walls + bench + well upgrade
                if(this.money >= 8){//prevent possible softlock by having the player always have at least one money to buy seeds.
                    this.money -= 7;
                    this.upgrades += 1;
                    this.sfxUpgrade.play();
                    let upgrade1 = this.map.createLayer("Upgrade-1", this.tileset, 0, 0);
                    upgrade1.setCollisionByProperty({ collides: true });
                    this.physics.add.collider(my.sprite.player, upgrade1);
                }
                break;
            case 2: //Wall + floor upgrade
                if(this.money >= 17){
                    this.money -= 16;
                    this.upgrades += 1;
                    this.sfxUpgrade.play();
                    let upgrade21 = this.map.createLayer("Upgrade-2-1", this.tileset, 0, 0);
                    let upgrade22 = this.map.createLayer("Upgrade-2-2", this.tileset, 0, 0);
                    upgrade21.setCollisionByProperty({ collides: true });
                    upgrade22.setCollisionByProperty({ collides: true });
                    this.physics.add.collider(my.sprite.player, upgrade21);
                    this.physics.add.collider(my.sprite.player, upgrade22);
                }
                break;
            case 3: //furnish house upgrade
                if(this.money >= 28){
                    this.money -= 27;
                    this.upgrades += 1;
                    this.sfxUpgrade.play();
                    let upgrade3 = this.map.createLayer("Upgrade-3-1", this.tileset, 0, 0);
                    upgrade3.setCollisionByProperty({ collides: true });
                    this.physics.add.collider(my.sprite.player, upgrade3);
                }
                break;
            case 4://win
                this.scene.start("end");
            default:
                this.sfxError.play();
        }
    }

    NPCbubble() {
        let player = my.sprite.player;
        this.hideBubbles();
        if(176 > player.body.y || player.body.y >= 210) {
            return;
        }
        let PlayerX = player.body.x;
        if(70 <= PlayerX && PlayerX <= 90){//CarrotSeed selling NPC
            this.bubbles[0].setVisible(true);
        }
        else if(105 <= PlayerX && PlayerX <= 125){//TomatoSeed selling NPC
            this.bubbles[1].setVisible(true);
        }
        else if(140 <= PlayerX && PlayerX <= 155){//BlueStarFruitSeed selling NPC
            this.bubbles[2].setVisible(true);
        }
        else if(505 <= PlayerX && PlayerX <= 525){//Carrot buying NPC
            this.bubbles[3].setVisible(true);
        }
        else if(535 <= PlayerX && PlayerX <= 555){//Tomato buying NPC
            this.bubbles[4].setVisible(true);
        }
        else if(565 <= PlayerX && PlayerX <= 580){//BlueStarFruit buying NPC
            this.bubbles[5].setVisible(true);
        }
    }

    NPCtalk(PlayerX){ //checks the player's position and respond with the right NPC depending on the X location.
        if(70 <= PlayerX && PlayerX <= 90){//CarrotSeed selling NPC
            if(this.money > 0){
                this.carrotseed += 1;
                this.money -= 1;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();
            }
        }
        if(105 <= PlayerX && PlayerX <= 125){//TomatoSeed selling NPC
            if(this.money > 1){
                this.tomatoseed += 1;
                this.money -= 2;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();
            }
        }
        if(140 <= PlayerX && PlayerX <= 155){//BlueStarFruitSeed selling NPC
            if(this.money > 3){
                this.bluestarseed += 1;
                this.money -= 4;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();                  
            }
        }
        if(505 <= PlayerX && PlayerX <= 525){//Carrot buying NPC
            if(this.carrot > 0){
                this.money += 2;
                this.carrot -= 1;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();
            }
        }
        if(535 <= PlayerX && PlayerX <= 555){//Tomato buying NPC
            if(this.tomato > 0){
                this.money += 4;
                this.tomato -= 1;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();
            }
        }
        if(565 <= PlayerX && PlayerX <= 580){//BlueStarFruit buying NPC
            if(this.bluestar > 0){
                this.money += 8;
                this.bluestar -= 1;
                this.sfxPurchase.play();
            }
            else{
                this.sfxError.play();
            }
        }
    }
}
