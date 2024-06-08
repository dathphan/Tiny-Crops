class Title extends Phaser.Scene { //this is the title screen
    constructor(){
        super("title");
    }

    //Note: Title Screen can become better. This is the working title screen for now. ////////Delete this comment when game title screen is better///////////////////////////

    create(){ 
        
        this.add.text(600, 150, "Little Crops",{  //title
            fontSize: 80
        }).setOrigin(0.5);

        this.Start = this.add.text(600, 550, "START",{ //start button
            fontSize: 50,
        }).setOrigin(0.5);
        
        this.Credits = this.add.text(600, 650, "CREDITS",{ //credits button
            fontSize: 50,
        }).setOrigin(0.5);

        this.Start.setInteractive({useHandCursor: true}); //Makes Start interactable so that pointerdown arrow function works.
        this.Credits.setInteractive({useHandCursor: true});
        
        this.Start.on("pointerdown", () => {//starts the game when pressed.
            this.scene.start("tilemap");
        });

        this.Credits.on("pointerdown", () => {//opens the credits when pressed
            this.CreditBackground = this.add.rectangle(600, 400, 1200, 800, "0x000000"); 
            this.CreditBackground.setInteractive({useHandCursor: true}); 
            this.CreditText = this.add.text(50, 50, "CREDITS:\nMade by Damon Phan and James Chen\nMade for CMPM 120\nMade in Phaser, using Tiled\nArt assets by cupnoodle: Sprout Lands \n\n\n\n\n\n           *click to exit*",{ 
                fontSize: 50,
                wordWrap: { 
                    width: 1200
                }
            });
            this.CreditBackground.on("pointerdown", () => { //removes the credits screen.
                this.CreditBackground.destroy();
                this.CreditText.destroy();
            });
        });
    }
}