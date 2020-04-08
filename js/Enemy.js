// class that defines an Enemy Sprite
class Enemy extends Phaser.GameObjects.Sprite {
  constructor(scene,x,y,enemyType){

    super(scene,x,y,enemyType);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.setOrigin(0.5,0.5);
    this.displayWidth = gameSettings.sizeFactor * this.width;
    this.displayHeight = gameSettings.sizeFactor * this.height;

    this.enemyType = enemyType;
    this.animation = enemyType + "_anim";

    this.nextArcherMove = 0;
    this.archerDelay = 2000;
    this.archerMoving = true;

    this.nextBullet = 0;
    this.bulletDelay = this.archerDelay;

    if(this.enemyType == "enemy1"){
      this.enemyHealth = 1;
    } else if(this.enemyType == "enemy2"){
      this.enemyHealth = 1;
    }

  }

  // function for when the enemy dies
  die(){
    // creating particle emitter
    var particles = this.scene.add.particles('particle');
    particles.displayWidth = gameSettings.sizeFactor * particles.width;
    particles.displayHeight = gameSettings.sizeFactor * particles.height;

    var emitter = particles.createEmitter({
        x: this.x,
        y: this.y,
        speed: 80,
        scale: 4,
        lifespan: 300,
        quantity: 1,
        frequency: 40,
    });

    // creating death animation
    this.scene.time.addEvent({
      delay: 500,
      callback: ()=>{
        emitter.manager.emitters.remove(emitter);
      },
      loop: false,
    });

    // destroy this sprite
    this.destroy();
  }

  // function for the enemy archers to shoot
  shoot(){
    if (this.nextBullet > this.scene.time.now) {
      return;
    }
    this.nextBullet = this.scene.time.now + this.bulletDelay;

    var bullet = new Bullet(this.scene,this.x,this.y,"arrow");
    this.scene.enemyBullets.add(bullet);

    if (Math.abs(this.x - this.scene.character.x) > Math.abs(this.y - this.scene.character.y)){
      if (this.x > this.scene.character.x){
        bullet.body.velocity.x = -gameSettings.bulletSpeed / 2;
        bullet.angle = 270;
      } else {
        bullet.body.velocity.x = gameSettings.bulletSpeed / 2;
        bullet.angle = 90;
      }
    } else {
      if (this.y > this.scene.character.y){
        bullet.body.velocity.y = -gameSettings.bulletSpeed / 2;
        bullet.angle = 0;
      } else {
        bullet.body.velocity.y = gameSettings.bulletSpeed / 2;
        bullet.angle = 180;
      }
    }
  }

  // algorithm for moving the enemy
  moveEnemy(){
    // enemy1
    if(this.enemyType == "enemy1"){
      if (this.scene.character.x > this.x + 10){
        this.body.velocity.x = gameSettings.enemySpeed;
        this.flipX = true;
      } else if (this.scene.character.x < this.x - 10){
        this.body.velocity.x = -gameSettings.enemySpeed;
        this.flipX = false;
      } else {
        this.body.velocity.x = 0;
      }

      if (this.scene.character.y > this.y + 10){
        this.body.velocity.y = gameSettings.enemySpeed;
      } else if (this.scene.character.y <  this.y){
        this.body.velocity.y = -gameSettings.enemySpeed - 10;
      } else {
        this.body.velocity.y = 0;
      }
    }
    // enemy2
    else if (this.enemyType == "enemy2"){
      if (this.nextArcherMove > this.scene.time.now) {
        this.shoot();
        return;
      }
      this.nextArcherMove = this.scene.time.now + this.archerDelay;
      if (this.archerMoving == true){
        if (this.x < config.width / 4){
          this.body.velocity.x = 20;
        } else if (this.x > 3 * config.width / 4){
          this.body.velocity.x = -20;
        }

        if (this.y < config.height / 4){
          this.body.velocity.y = 20;
        } else if (this.y > 3 * config.height / 4){
          this.body.velocity.y = -20;
        }
        this.archerMoving = false;
      } else {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.archerMoving = true;
      }

    }

  }

  // updates the state of the enemy
  update(){
    this.moveEnemy();
    if (this.x > this.scene.character.x){
      this.flipX = false;
    } else {
      this.flipX = true;
    }
  }


}
