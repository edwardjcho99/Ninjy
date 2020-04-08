// game settings
var gameSettings = {
  sizeFactor: 5,
  bulletSpeed: 500,
  bulletDelay: 400,
  enemySpawnDelay: 1000,
  powerupDelay: 30000,
  enemySpeed: 60,
  enemiesMultiple: 1,
  maxEnemies: 2,
  difficulty: 0
}

// configuration for the GameScene
var config = {
  parent: "game",
  width: 650,
  height: 650,
  backgroundColor:0x458B00,
  scene: [SplashScreen, MainScene, DeathScreen],
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    }
  }
}

// variables
var score = 0;
var highScore = 0;

// helper method
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// start game
var game = new Phaser.Game(config);
