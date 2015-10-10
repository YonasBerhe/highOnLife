var highOnLife = new Phaser.Game(450, 450, Phaser.AUTO, 'highOnLife', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  highOnLife.load.baseURL = 'http://examples.phaser.io/assets/';
  highOnLife.load.crossOrigin = 'anonymous';

  highOnLife.load.image('phaser', 'sprites/phaser-dude.png');

}

var character;

function create() {

  character = highOnLife.add.sprite(highOnLife.world.centerX, highOnLife.world.centerY, 'phaser');

  character.anchor.setTo(0.5, 0.5);

  character.scale.setTo(1, 1);
}

function update() {
  // Check is left and is in bound
  console.log(character.x);
  console.log(character.y);
  if (highOnLife.input.keyboard.isDown(Phaser.Keyboard.LEFT) && character.x > 0) {
    character.x -= 4;
  } else if (highOnLife.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && character.x < 450) {
    character.x += 4;
  }

  if (highOnLife.input.keyboard.isDown(Phaser.Keyboard.UP) && character.y > 0) {
    character.y -= 4;
  } else if (highOnLife.input.keyboard.isDown(Phaser.Keyboard.DOWN) && character.y < 450) {
    character.y += 4;
  }
}
