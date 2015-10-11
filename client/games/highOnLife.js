var game = new Phaser.Game(450, 450, Phaser.AUTO, 'highOnLife', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  console.log("PRELOAD");

  game.load.baseURL = 'http://examples.phaser.io/assets/';
  game.load.crossOrigin = 'anonymous';

  game.load.image('phaser', 'sprites/phaser-dude.png');

}

var character;
// var drugs = [];

// var Drug = require('drug').Drug;

function create() {
  console.log("CREATE");

  // drugs[0] = new Drug();

  character = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');

  character.anchor.setTo(0.5, 0.5);

  character.scale.setTo(1, 1);
}

function update() {
  // Check is left and is in bound
<<<<<<< HEAD
  //console.log(character.x);
  //console.log(character.y);
  if (highOnLife.input.keyboard.isDown(Phaser.Keyboard.LEFT) && character.x > 0) {
=======
  // console.log(character.x);
  // console.log(character.y);
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && character.x > 0) {
>>>>>>> ccdd2ef695276dfe39f783d500d82ce63ac35d03
    character.x -= 4;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && character.x < 450) {
    character.x += 4;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && character.y > 0) {
    character.y -= 4;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && character.y < 450) {
    character.y += 4;
  }
}
