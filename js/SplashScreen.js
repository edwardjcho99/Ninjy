// the class for the SplashScreen scene.
class SplashScreen extends Phaser.Scene {
  constructor() {
    super("startGame");
  }

  preload(){
    this.load.image("arrows","assets/images/arrows.png");
    this.load.image("wasd","assets/images/wasd.png");
    this.load.image("apple","assets/images/apple.png");

    this.load.audio("click1",["assets/sounds/Click1.ogg"]);

    this.load.spritesheet("character","assets/images/character.png",{
      frameWidth: 8,
      frameHeight: 8
    });

    this.keys = this.input.keyboard.addKeys('W,S,A,D,UP,DOWN,RIGHT,LEFT');
  }

  create() {

    this.wasPressed = false;

    this.moveLabel = this.add.text(config.width/3,config.height/2 - 70,"move",{fontSize: "25px", fontFamily: "peepo"});
    this.moveLabel.setOrigin(0.5);

    this.shootLabel = this.add.text(2*config.width/3,config.height/2 - 70,"shoot",{fontSize: "25px", fontFamily: "peepo"});
    this.shootLabel.setOrigin(0.5);

    this.collectTheseLabel = this.add.text(config.width/2 - 50,2*config.height/3,"collect these:",{fontSize: "25px", fontFamily: "peepo"});
    this.collectTheseLabel.setOrigin(0.5);

    this.apple = this.add.image(config.width/2 + 70,2*config.height/3,"apple");
    this.apple.displayWidth = gameSettings.sizeFactor * this.apple.width;
    this.apple.displayHeight = gameSettings.sizeFactor * this.apple.height;

    this.character = this.add.sprite(config.width/2,config.height/2,"character");
    this.character.setScale(gameSettings.sizeFactor);
    this.character.setOrigin(0.5,0.5);

    this.wasd = this.add.image(config.width/3,config.height/2,"wasd");
    this.wasd.setOrigin(0.5);
    this.wasd.setScale(1);
    this.arrows = this.add.image(2*config.width/3,config.height/2,"arrows");
    this.arrows.setOrigin(0.5);
    this.arrows.setScale(1);

    this.anims.create({
      key: "character_anim",
      frames: this.anims.generateFrameNumbers("character"),
      frameRate: 10,
      repeat: -1
    })
    this.character.play("character_anim");

  }

  update(){

    // checks to see if a key is pressed to begin game
    if((this.keys.W.isDown || this.keys.A.isDown || this.keys.S.isDown || this.keys.D.isDown || this.keys.UP.isDown || this.keys.DOWN.isDown || this.keys.LEFT.isDown || this.keys.RIGHT.isDown) && this.wasPressed == false){
      this.sound.play("click1");
      this.wasPressed = true;

      // adds animations
      this.add.tween({
        targets: [this.wasd,this.moveLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => this.wasd.x,
          getEnd: () => 0,
        },
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
      });
      this.add.tween({
        targets: [this.arrows,this.shootLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => this.arrows.x,
          getEnd: () => config.width,
        },
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
        onComplete: () => {
          this.scene.start("playGame");
        }
      });
      this.add.tween({
        targets: [this.apple,this.collectTheseLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        y: {
          getStart: () => this.apple.y,
          getEnd: () => config.height + 100,
        },
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
      });
    }
  }
}
