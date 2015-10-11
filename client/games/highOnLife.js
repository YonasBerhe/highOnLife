var game = new Phaser.Game(450, 450, Phaser.AUTO, 'highOnLife', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  console.log("PRELOAD");

  game.load.image('dude', '/assets/misc/sprites/dude.png');

  game.load.image('starfield', '/assets/bg/starfield.jpg');

  game.load.spritesheet('player', 'assets/sprites/spaceman.png', 16, 16);
}

var player;
var s;

function create() {
  console.log("CREATE");

  // s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  game.stage.backgroundColor = '#ffffff';

  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);

  left = player.animations.add('left', [8, 9], 10, true);
  right = player.animations.add('right', [1, 2], 10, true);
  player.animations.add('up', [11, 12, 13], 10, true);
  player.animations.add('down', [4, 5, 6], 10, true);

  left.enableUpdate = true;
  right.enableUpdate = true;

  // character = game.add.sprite(game.world.centerX, game.world.centerY, 'phaser');

  player.anchor.setTo(0.5, 0.5);

  player.scale.setTo(2, 2);
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var moving = false;

function update() {
  // Check is left and is in bound
  // console.log(player.x);
  // console.log(player.y);

    moving = false;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.x > 0) {
    player.x -= 4;
    player.play('left');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.x < 450) {
    player.x += 4;
    player.play('right');
    moving = true;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.y > 0) {
    player.y -= 4;
    player.play('up');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.y < 450) {
    player.y += 4;
    player.play('down');
    moving = true;
  }

  if (moving) {
    game.stage.backgroundColor = getRandomColor();
  } else {
    player.animations.stop();
  }
}
