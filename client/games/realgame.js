var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
  game.load.image('starfield', '/assets/misc/starfield.jpg');

  // game.load.baseURL = 'http://examples.phaser.io/assets/';
  // game.load.crossOrigin = 'anonymous';
  //
  // // load the player
  // game.load.image('phaser', 'sprites/phaser-dude.png');
  // // load the drugzzz
  // game.load.image('meth', '/sprites/orb-blue.png');
  // game.load.image('weed', '/sprites/orb-green.png');
  // game.load.image('lsd', '/sprites/orb-red.png');

}

var player;
var drugs;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;

var s;

function create() {

  // Check bounds collisions against all walls
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // use set bound to canvas size plus acount for sprite size
  game.world.setBounds(0, 0, game.width - 10, game.height - 10);

  // add background
  s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  drugs = game.add.group();
  drugs.enableBody = true;
  drugs.physicsBodyType = Phaser.Physics.ARCADE;

  var drug;

  for (var i = 0; i < 8; i++) {
    drug = drugs.create(game.world.randomX, game.world.randomY, 'breakout', 'brick_' + 3 + '_1.png');
    drug.body.bounce.set(1);
    drug.body.immovable = true;
  }


  player = game.add.sprite(game.world.centerX, game.world.centerY, 'breakout', 'paddle_big.png');
  player.anchor.setTo(0.5, 0.5);
  player.scale.setTo(1, 1);

  game.physics.enable(player, Phaser.Physics.ARCADE);

  player.body.collideWorldBounds = true;
  player.body.bounce.set(1);
  // player.body.immovable = true;

  scoreText = game.add.text(32, 550, 'score: 0', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });
  livesText = game.add.text(680, 550, 'lives: 3', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });
  // introText = game.add.text(game.world.centerX, 400, '- click to start -', {
  //   font: "40px Arial",
  //   fill: "#ffffff",
  //   align: "center"
  // });
  // introText.anchor.setTo(0.5, 0.5);
}

function update() {

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    player.x -= 4;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    player.x += 4;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    player.y -= 4;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    player.y += 4;
  }


  // if (player.body.x == drug.body.x && player.body.y == drug.body.y) {
  //   console.log("drugs!");
  // } else {
  // game.physics.arcade.collide(ball, player, ballHitplayer, null, this);
  game.physics.arcade.overlap(player, drugs, playerHitdrug, null, this);
  // }
}

function gameOver() {

  ball.body.velocity.setTo(0, 0);

  introText.text = 'Game Over!';
  introText.visible = true;

}

function playerHitdrug(_player, _drug) {
  console.log('Collision!');
  _drug.kill();

  score += 10;

  scoreText.text = 'score: ' + score;

  //  Are they any drugs left?
  if (drugs.countLiving() === 0) {
    //  New level starts
    score += 1000;
    scoreText.text = 'score: ' + score;
    // introText.text = '- Next Level -';

    //  And bring the drugs back from the dead :)
    drugs.callAll('revive');
  }

}
