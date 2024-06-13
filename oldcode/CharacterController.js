class CharacterController extends Phaser.Scene {
    constructor() {
        super("characterController");
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
    }

    init() {
        this.TILESIZE = 16;
        this.SCALE = 2.0;
        this.TILEWIDTH = 40;
        this.TILEHEIGHT = 25;

        this.PLAYERSPEED = 50;
        this.direction = "down";
    }

    create() {
        this.cameras.main.setZoom(this.SCALE);

        this.createAnimations();
        this.initalizeInputs();

        my.sprite.player = this.physics.add.sprite(400, 300, 'player');
        my.sprite.player.play('idle_left');
    }

    update() {
        this.updatePlayerMovement();
        this.updatePlayerAnimations();
    }

    player_idle() {

    }

    createAnimations() {
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

    initalizeInputs() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    updatePlayerMovement() {
        my.sprite.player.setVelocity(0);
        
        let up = (this.cursors.up.isDown || this.wasd.up.isDown) ? 1 : 0;
        let down = (this.cursors.down.isDown || this.wasd.down.isDown) ? 1 : 0;
        
        let left = (this.cursors.left.isDown || this.wasd.left.isDown) ? 1 : 0;
        let right = (this.cursors.right.isDown || this.wasd.right.isDown) ? 1 : 0;

        my.sprite.player.setVelocityY(this.PLAYERSPEED * (down - up));
        my.sprite.player.setVelocityX(this.PLAYERSPEED * (right - left));
        console.log((right - left))
    }

    updatePlayerAnimations() {

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
}
