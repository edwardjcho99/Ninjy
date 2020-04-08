// The class for the DeathScreen scene
class DeathScreen extends Phaser.Scene {
  constructor() {
    super("betweenGame");
  }

  preload(){
    this.load.image("arrows","assets/images/arrows.png");
    this.load.image("wasd","assets/images/wasd.png");

    this.load.audio("click1",["assets/sounds/Click1.ogg"]);

    this.load.spritesheet("character","assets/images/character.png",{
      frameWidth: 8,
      frameHeight: 8
    });

    this.keys = this.input.keyboard.addKeys('W,S,A,D,UP,DOWN,RIGHT,LEFT');
  }

  create() {
    this.wasPressed = false;

    // creating labels
    this.moveLabel = this.add.text(0,config.height/2 - 70,"move",{fontSize: "25px", fontFamily: "peepo"});
    this.moveLabel.setOrigin(0.5);
    this.moveLabel.alpha = 0;
    this.wasd = this.add.image(0,config.height/2,"wasd");
    this.wasd.setOrigin(0.5);
    this.wasd.setScale(1);
    this.wasd.alpha = 0;

    // creating animations
    this.add.tween({
      targets: [this.wasd,this.moveLabel],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 200,
      x: {
        getStart: () => 0,
        getEnd: () => config.width/3,
      },
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      }
    });

    // creating more images and labels and animations
    this.shootLabel = this.add.text(config.width,config.height/2 - 70,"shoot",{fontSize: "25px", fontFamily: "peepo"});
    this.shootLabel.setOrigin(0.5);
    this.shootLabel.alpha = 0;
    this.arrows = this.add.image(config.width,config.height/2,"arrows");
    this.arrows.setOrigin(0.5);
    this.arrows.setScale(1);
    this.arrows.alpha = 0;
    this.add.tween({
      targets: [this.arrows,this.shootLabel],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 200,
      x: {
        getStart: () => config.width,
        getEnd: () => 2*config.width/3,
      },
      alpha: {
        getStart: () => 0,
        getEnd: () => 1,
      }
    });

    this.character = this.add.sprite(config.width/2,config.height/2,"character");
    this.character.setScale(gameSettings.sizeFactor);
    this.character.setOrigin(0.5,0.5);

    this.scoreLabel = this.add.text(config.width/2,config.height/4 - 30,score,{fontSize: "200px", fontFamily: "peepo"});
    this.scoreLabel.setOrigin(0.5);

    this.preScoreLabel = this.add.text(config.width/2 - 150,-100,"Score:",{fontSize: "25px", fontFamily: "peepo"});
    this.preScoreLabel.setOrigin(0.5);

    this.highScoreLabel = this.add.text(-200,2*config.height/3,"High Score: " + highScore,{fontSize: "25px", fontFamily: "peepo"});
    this.highScoreLabel.setOrigin(0.5);

    this.add.tween({
      targets: [this.preScoreLabel],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 200,
      y: {
        getStart: () => -100,
        getEnd: () => config.height/4 - 30,
      },
    });

    this.add.tween({
      targets: [this.highScoreLabel],
      ease: 'Sine.easeInOut',
      duration: 1000,
      delay: 200,
      x: {
        getStart: () => -200,
        getEnd: () => config.width/2,
      },
    });

    this.anims.create({
      key: "character_anim",
      frames: this.anims.generateFrameNumbers("character"),
      frameRate: 10,
      repeat: -1
    })
    this.character.play("character_anim");

  }

  update(){
    // checks to see if a new game is started when a key is pressed
    if((this.keys.W.isDown || this.keys.A.isDown || this.keys.S.isDown || this.keys.D.isDown || this.keys.UP.isDown || this.keys.DOWN.isDown || this.keys.LEFT.isDown || this.keys.RIGHT.isDown) && this.wasPressed == false){
      this.wasPressed = true;
      this.sound.play("click1");
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
        // onComplete: () => {
        //
        // }
      });

      // change scene animation
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
        targets: [this.scoreLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => config.width/2,
          getEnd: () => config.width + 250,
        },
      });
      var scoreLabelCopy = this.add.text(0,config.height/4 - 30,0,{fontSize: "200px", fontFamily: "peepo"});
      scoreLabelCopy.setOrigin(0.5);
      this.add.tween({
        targets: [scoreLabelCopy],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => 0,
          getEnd: () => config.width/2,
        },
      });

      this.add.tween({
        targets: [this.preScoreLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => config.width/2 - 150,
          getEnd: () => config.width+150,
        },
      });

      this.add.tween({
        targets: [this.highScoreLabel],
        ease: 'Sine.easeInOut',
        duration: 1000,
        delay: 0,
        x: {
          getStart: () => config.width/2,
          getEnd: () => -200,
        },
      });
    }
  }
}
