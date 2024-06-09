class Ending extends Phaser.Scene { //this is the ending screen
    constructor(){
        super("end");
    }

//As of now, no way of using this. Will work to look better later. 

    create(){
        
        this.add.text(600, 150, "YOU WIN!",{  
            fontSize: 80
        }).setOrigin(0.5);

        this.add.text(600, 650, "press space to restart", {
            fontSize: 50
        }).setOrigin(0.5);

        this.add.text(600, 550, "press Q to return to menu", {
            fontSize: 50
        }).setOrigin(0.5);

        this.Q = this.input.keyboard.addKey("q"); //keys added so game can read them
        this.spacebarpress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE); 
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.spacebarpress)) {//restarts game if space is pressed.
            this.scene.start("tilemap");
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.Q)) { //goes to menu if q if pressed
            this.scene.start("title");
        }
    }
}