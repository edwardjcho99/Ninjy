// class that defines the bullet Sprite
class Bullet extends Phaser.GameObjects.Sprite {
  constructor(scene,x,y,bulletType){

    super(scene,x,y,bulletType);
    scene.add.existing(this);
    scene.physics.world.enableBody(this);
    this.displayWidth = gameSettings.sizeFactor * this.width;
    this.displayHeight = gameSettings.sizeFactor * this.height;

  }

  // updates state of bullet
  update(){
    if(this.x < 0 || this.x > config.width || this.y < 0 || this.y > config.height){
      this.destroy();
    }

  }


}
