// The class for the MainScene scene
class MainScene extends Phaser.Scene {
  constructor() {
    super("playGame")
  }

  preload() {

    // preloading images and spritesheets
    this.load.image("mushroom","assets/images/mushroom.png");
    this.load.image("bullet","assets/images/bullet.png");
    this.load.image("arrow","assets/images/arrow.png");
    this.load.image("apple","assets/images/apple.png");
    this.load.image("particle","assets/images/particle.png");

    this.load.audio("bell2",["assets/sounds/Bell2.ogg"]);
    this.load.audio("gun11",["assets/sounds/Gun11.ogg"]);
    this.load.audio("gun12",["assets/sounds/Gun12.ogg"]);
    this.load.audio("impact2",["assets/sounds/Impact2.ogg"]);
    this.load.audio("powerup1",["assets/sounds/PowerUp1.ogg"]);
    this.load.audio("music",["assets/sounds/music.mp3"]);

    this.load.spritesheet("enemy1","assets/images/enemy.png",{
      frameWidth: 8,
      frameHeight: 8
    });
    this.load.spritesheet("enemy2","assets/images/enemy2.png",{
      frameWidth: 8,
      frameHeight: 8
    });
    this.load.spritesheet("character","assets/images/character.png",{
      frameWidth: 8,
      frameHeight: 8
    });

    // adding the keys input
    this.keys = this.input.keyboard.addKeys('W,S,A,D,UP,DOWN,RIGHT,LEFT');
  }

  create() {

    // music
    this.music = this.sound.add("music");
    this.music.play();

    // creating a score variable and label
    this.score = 0;
    this.scoreLabel = this.add.text(config.width/2,config.height/ 4 - 30,this.score,{fontSize: "200px", fontFamily: "peepo"});
    this.scoreLabel.setOrigin(0.5);

    // creating groups for the sprites
    this.bullets = this.physics.add.group();
    this.enemyBullets = this.physics.add.group();
    this.enemies = this.physics.add.group();

    // creating the character sprite
    this.character = this.physics.add.sprite(config.width/2,config.height/2,"character");
    this.character.setScale(gameSettings.sizeFactor);
    this.character.setOrigin(0.5,0.5);
    this.character.setCollideWorldBounds(true);

    // creating the apple sprite
    this.apple = this.physics.add.sprite(0,0,"apple");
    this.apple.x = getRandomInt(config.width - 40) + 20;
    this.apple.y = getRandomInt(config.height - 40) + 20;
    this.apple.displayWidth = gameSettings.sizeFactor * this.apple.width;
    this.apple.displayHeight = gameSettings.sizeFactor * this.apple.height;

    // creating the powerup sprite
    this.powerup = this.physics.add.sprite(0,0,"mushroom");
    this.canSpawnPowerup = true;
    this.powerUpped = false;
    this.powerup.x = getRandomInt(config.width - 40) + 20;
    this.powerup.y = getRandomInt(config.height - 40) + 20;
    this.powerup.displayWidth = gameSettings.sizeFactor * this.apple.width;
    this.powerup.displayHeight = gameSettings.sizeFactor * this.apple.height;

    this.keys = this.input.keyboard.addKeys('W,S,A,D,LEFT,RIGHT,UP,DOWN,SPACE');

    // variables
    this.nextShotAt = 0;
    this.nextPowerupAt = 0;
    this.nextEnemyAt = 0;
    this.finishPowerupped = 0;
    this.lastFired = 0;
    this.bulletType = "standard";

    // adding physics events
    this.physics.add.overlap(this.bullets,this.enemies,function(bullet,enemy){
      enemy.die();
      this.sound.play("impact2");
    },null,this);

    this.physics.add.overlap(this.character,this.enemies,function(character,enemy){
      this.die();
      this.sound.play("impact2");
    },null,this);

    this.physics.add.overlap(this.character,this.enemyBullets,function(character,enemyBullet){
      this.die();
      this.sound.play("impact2");
    },null,this);
    this.physics.add.overlap(this.character,this.apple,function(character,apple){
      apple.disableBody(false, false);
      this.score++;
      this.sound.play("bell2");
      this.add.tween({
        targets: apple,
        ease: 'Sine.easeInOut',
        duration: 500,
        delay: 0,
        y: {
          getStart: () => apple.y,
          getEnd: () => apple.y - 40,
        },
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
        onComplete: () => {
          this.spawnApple();
          apple.alpha = 1;
          apple.enableBody(true,apple.x,apple.y,true,true);
        }
      });
    },null,this);
    this.physics.add.overlap(this.character,this.powerup,function(character,powerup){
      this.canSpawnPowerup = true;
      this.sound.play("powerup1");
      var n = getRandomInt(10);
      if (n < 4){
        this.bulletType = "maelstrom";
      } else {
        this.bulletType = "shotgun";
      }
      powerup.disableBody(false, false);
      this.add.tween({
        targets: powerup,
        ease: 'Sine.easeInOut',
        duration: 500,
        delay: 0,
        y: {
          getStart: () => powerup.y,
          getEnd: () => powerup.y - 40,
        },
        alpha: {
          getStart: () => 1,
          getEnd: () => 0,
        },
        onComplete: () => {
          this.powerup.setVisible(false);
          this.powerup.x = 1000;
          powerup.alpha = 1;
          powerup.enableBody(true,powerup.x,powerup.y,true,true);
        }
      });
      this.powerUpped = true;
      this.finishPowerupped = this.time.now + gameSettings.powerupDelay / 4;
    },null,this);

    // creating animations
    this.anims.create({
      key: "character_anim",
      frames: this.anims.generateFrameNumbers("character"),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: "enemy1_anim",
      frames: this.anims.generateFrameNumbers("enemy1"),
      frameRate: 10,
      repeat: -1
    })

    this.anims.create({
      key: "enemy2_anim",
      frames: this.anims.generateFrameNumbers("enemy2"),
      frameRate: 10,
      repeat: -1
    })

    this.character.play("character_anim");
  }

  // function to move the main player
  movePlayer(){
    if(this.keys.A.isDown){
      this.character.body.velocity.x = -200;
      this.character.flipX = false;
    }
    else if(this.keys.D.isDown){
      this.character.body.velocity.x = 200;
      this.character.flipX = true;
    }
    else {
      this.character.body.velocity.x = 0;
    }
    if(this.keys.W.isDown){
      this.character.body.velocity.y = -200;
    }
    else if(this.keys.S.isDown){
      this.character.body.velocity.y = 200;
    }
    else {
      this.character.body.velocity.y = 0;
    }

  }

  // function to spawn an apple
  spawnApple(){
    this.apple.x = getRandomInt(config.width - 40) + 20;
    this.apple.y = getRandomInt(config.height - 40) + 20;

    if (this.score % 5 == 0){
      gameSettings.difficulty++;
      if (gameSettings.difficulty % 3 == 0){
        gameSettings.enemiesMultiple++;
      } else if (gameSettings.difficulty % 3 == 1){
        gameSettings.enemySpeed += 2;
        gameSettings.maxEnemies += 1;
      } else if (gameSettings.difficulty % 3 == 2){
        gameSettings.enemySpeed += 2;
        gameSettings.maxEnemies += 1;
      }
    }
  }

  // function to spawn a powerup
  spawnPowerup(){
    if (this.canSpawnPowerup == true){
      if (this.nextPowerupAt > this.time.now) {
        return;
      }
      this.nextPowerupAt = this.time.now + gameSettings.powerupDelay;

      this.powerup.x = getRandomInt(config.width - 40) + 20;
      this.powerup.y = getRandomInt(config.height - 40) + 20;
      this.canSpawnPowerup = false;
      this.powerup.setVisible(true);
    }
  }

  // function to spawn an enemy
  spawnEnemy(enemyType){
    if (this.nextEnemyAt > this.time.now || this.enemies.getChildren().length >= gameSettings.maxEnemies) {
      return;
    }
    this.nextEnemyAt = this.time.now + gameSettings.enemySpawnDelay;


    for (var i = 0; i < gameSettings.enemiesMultiple; i++){
      var spawnSideOrTop = getRandomInt(2);
      var x = 0;
      var y = 0;
      if (spawnSideOrTop == 0){
        x = config.width * getRandomInt(2);
        y = getRandomInt(config.height);
      } else {
        x = getRandomInt(config.width);
        y = config.height * getRandomInt(2);
      }
      var enemy = new Enemy(this,x,y,enemyType);
      enemy.play(enemy.animation);
      this.enemies.add(enemy);
    }

  }

  // function to play gun sound
  playRandomGunSound(){
    var n = getRandomInt(2);
    if(n == 0){
      this.sound.play("gun11");
    } else if(n == 1){
      this.sound.play("gun12");
    }
  }

  // function to shoot bullet
  shootBullet(type){
    // standard gun
    if(type == "standard"){
      if(this.keys.LEFT.isDown && this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = -gameSettings.bulletSpeed / Math.sqrt(2);
        bullet.body.velocity.y = -gameSettings.bulletSpeed / Math.sqrt(2);
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if (this.keys.LEFT.isDown && this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = -gameSettings.bulletSpeed / Math.sqrt(2);
        bullet.body.velocity.y = gameSettings.bulletSpeed / Math.sqrt(2);
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if (this.keys.RIGHT.isDown && this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = gameSettings.bulletSpeed / Math.sqrt(2);
        bullet.body.velocity.y = -gameSettings.bulletSpeed / Math.sqrt(2);
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if (this.keys.RIGHT.isDown && this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = gameSettings.bulletSpeed / Math.sqrt(2);
        bullet.body.velocity.y = gameSettings.bulletSpeed / Math.sqrt(2);
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if(this.keys.LEFT.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = -gameSettings.bulletSpeed;
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if(this.keys.RIGHT.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.x = gameSettings.bulletSpeed;
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if(this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.y = -gameSettings.bulletSpeed;
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      } else if(this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet);
        bullet.body.velocity.y = gameSettings.bulletSpeed;
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      }
    }
    // shotgun
    else if(type == "shotgun"){
      if(this.keys.LEFT.isDown && this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 4 - Math.PI / 9);
        bullet1.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 4 - Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = -gameSettings.bulletSpeed / Math.sqrt(2);
        bullet2.body.velocity.y = -gameSettings.bulletSpeed / Math.sqrt(2);

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 4 + Math.PI / 9);
        bullet3.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 4 + Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if (this.keys.LEFT.isDown && this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 4 - Math.PI / 9);
        bullet1.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 4 - Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = -gameSettings.bulletSpeed / Math.sqrt(2);
        bullet2.body.velocity.y = gameSettings.bulletSpeed / Math.sqrt(2);

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 4 + Math.PI / 9);
        bullet3.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 4 + Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if (this.keys.RIGHT.isDown && this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 4 - Math.PI / 9);
        bullet1.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 4 - Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = gameSettings.bulletSpeed / Math.sqrt(2);
        bullet2.body.velocity.y = -gameSettings.bulletSpeed / Math.sqrt(2);

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 4 + Math.PI / 9);
        bullet3.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 4 + Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if (this.keys.RIGHT.isDown && this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 4 - Math.PI / 9);
        bullet1.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 4 - Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = gameSettings.bulletSpeed / Math.sqrt(2);
        bullet2.body.velocity.y = gameSettings.bulletSpeed / Math.sqrt(2);

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 4 + Math.PI / 9);
        bullet3.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 4 + Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if(this.keys.LEFT.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 9);
        bullet1.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = -gameSettings.bulletSpeed;
        bullet2.body.velocity.y = 0;

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = -gameSettings.bulletSpeed * Math.cos(Math.PI / 9);
        bullet3.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if(this.keys.RIGHT.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 9);
        bullet1.body.velocity.y = -gameSettings.bulletSpeed * Math.sin(Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = gameSettings.bulletSpeed;
        bullet2.body.velocity.y = 0;

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = gameSettings.bulletSpeed * Math.cos(Math.PI / 9);
        bullet3.body.velocity.y = gameSettings.bulletSpeed * Math.sin(Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if(this.keys.UP.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = -gameSettings.bulletSpeed * Math.sin(Math.PI / 9);
        bullet1.body.velocity.y = -gameSettings.bulletSpeed * Math.cos(Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = 0;
        bullet2.body.velocity.y = -gameSettings.bulletSpeed;

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = gameSettings.bulletSpeed * Math.sin(Math.PI / 9);
        bullet3.body.velocity.y = -gameSettings.bulletSpeed * Math.cos(Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;

      } else if(this.keys.DOWN.isDown && this.time.now > this.lastFired){
        this.playRandomGunSound();
        var bullet1 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet1);
        bullet1.body.velocity.x = -gameSettings.bulletSpeed * Math.sin(Math.PI / 9);
        bullet1.body.velocity.y = gameSettings.bulletSpeed * Math.cos(Math.PI / 9);

        var bullet2 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet2);
        bullet2.body.velocity.x = 0;
        bullet2.body.velocity.y = gameSettings.bulletSpeed;

        var bullet3 = new Bullet(this,this.character.x,this.character.y,"bullet");
        this.bullets.add(bullet3);
        bullet3.body.velocity.x = gameSettings.bulletSpeed * Math.sin(Math.PI / 9);
        bullet3.body.velocity.y = gameSettings.bulletSpeed * Math.cos(Math.PI / 9);

        this.lastFired = this.time.now + gameSettings.bulletDelay;
      }
    }
    // maelstrom
    else if(type == "maelstrom"){
      if((this.keys.LEFT.isDown || this.keys.RIGHT.isDown || this.keys.UP.isDown || this.keys.DOWN.isDown) && this.time.now > this.lastFired){
        var angle = 0;
        this.time.addEvent({
          delay: 50,
          callback: ()=>{
            var bullet = new Bullet(this,this.character.x,this.character.y,"bullet");
            this.playRandomGunSound();
            this.bullets.add(bullet);
            bullet.body.velocity.x = gameSettings.bulletSpeed * Math.cos(angle);
            bullet.body.velocity.y = gameSettings.bulletSpeed * Math.sin(angle);
            angle += Math.PI / 6;
          },
          repeat: 2 * Math.PI / (Math.PI / 6),
        });
        this.lastFired = this.time.now + gameSettings.bulletDelay;
      }
    }
  }

  // function for when the character dies
  die(){
    var particles = this.add.particles('particle');
    particles.displayWidth = gameSettings.sizeFactor * particles.width;
    particles.displayHeight = gameSettings.sizeFactor * particles.height;

    var emitter = particles.createEmitter({
        x: this.character.x,
        y: this.character.y,
        speed: 80,
        scale: 4,
        lifespan: 300,
        quantity: 1,
        frequency: 40,
    });

    this.character.setVisible(false);
    this.time.addEvent({
      delay: 500,
      callback: ()=>{
        emitter.manager.emitters.remove(emitter);
        score = this.score;
        if (score > highScore){
          highScore = score;
        }
        this.scene.start("betweenGame");
        gameSettings.enemySpeed = 60;
        gameSettings.enemiesMultiple = 1;
        gameSettings.maxEnemies = 2;
      },
      loop: false,
    });
    this.music.stop();
  }

  // updates game loop
  update() {
    this.movePlayer();
    this.shootBullet(this.bulletType);
    this.spawnPowerup();

    if (this.time.now > this.finishPowerupped){
      this.bulletType = "standard";
    }

    // algorithm to spawn enemies
    if (this.score < 5){
      this.spawnEnemy("enemy1")
    } else {
      var randNum = getRandomInt(10);
      if (randNum < 2){
        this.spawnEnemy("enemy2");
      } else {
        this.spawnEnemy("enemy1");
      }
    }

    // updating sprites and scoreLabel
    for (var i = 0; i < this.bullets.getChildren().length; i++){
      var bullet = this.bullets.getChildren()[i];
      bullet.update();
    }

    for (var i = 0; i < this.enemies.getChildren().length; i++){
      var enemy = this.enemies.getChildren()[i];
      enemy.update();
    }
    this.scoreLabel.setText(this.score);
  }
}
