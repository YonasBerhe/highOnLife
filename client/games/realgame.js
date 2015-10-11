var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', {
  preload: preload,
  create: create,
  update: update
});

function preload() {

  game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
  // game.load.image('starfield', '/assets/misc/starfield.jpg');

  game.load.baseURL = 'http://examples.phaser.io/assets/';
  game.load.crossOrigin = 'anonymous';

  // load the player
  game.load.image('phaser', 'sprites/phaser-dude.png');
  // load the drugzzz
  game.load.image('meth', '/sprites/orb-blue.png');
  game.load.image('weed', '/sprites/orb-green.png');
  game.load.image('lsd', '/sprites/orb-red.png');

}

var ball;
var paddle;
var drugs;

var ballOnPaddle = true;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var introText;

var s;

function create() {

  //  Make our game world 2000x2000 pixels in size (the default is to match the game size)
  // game.world.setBounds(0, 0, 2000, 2000);
  // use set bound to canvas size plus acount for sprite size
  game.world.setBounds(0, 0, game.width - 10, game.height - 10);

  // Check bounds collisions against all walls
  game.physics.startSystem(Phaser.Physics.ARCADE);

  // add background
  // s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  drugs = game.add.group();
  drugs.enableBody = true;
  drugs.physicsBodyType = Phaser.Physics.ARCADE;

  var drug;

    for (var i = 0; i < 8; i++) {
      drug = drugs.create(game.world.randomX, game.world.randomY, 'breakout', 'meth');
      // drug.body.bounce.set(1);
      drug.body.immovable = true;
    }


  paddle = game.add.sprite(game.world.centerX, game.world.centerY, 'breakout', 'phaser');
  paddle.anchor.setTo(0.5, 0.5);
  paddle.scale.setTo(1, 1);

  game.physics.enable(paddle, Phaser.Physics.ARCADE);

  paddle.body.collideWorldBounds = true;
  // paddle.body.bounce.set(1);
  // paddle.body.immovable = true;

  // ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'breakout', 'ball_1.png');
  // ball.anchor.set(0.5);
  // ball.checkWorldBounds = true;

  // game.physics.enable(ball, Phaser.Physics.ARCADE);
  //
  // ball.body.collideWorldBounds = true;
  // ball.body.bounce.set(1);
  //
  // ball.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);
  //
  // ball.events.onOutOfBounds.add(ballLost, this);

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
  introText = game.add.text(game.world.centerX, 400, '- click to start -', {
    font: "40px Arial",
    fill: "#ffffff",
    align: "center"
  });
  introText.anchor.setTo(0.5, 0.5);

  // game.input.onDown.add(releaseBall, this);

}

function update() {

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        paddle.x -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        paddle.x += 4;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        paddle.y -= 4;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        paddle.y += 4;
    }


  // if (ballOnPaddle) {
  //   ball.body.x = paddle.x;
  // } else {
  //   game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
  //   game.physics.arcade.collide(ball, drugs, ballHitdrug, null, this);
  // }

}

function releaseBall() {

  if (ballOnPaddle) {
    ballOnPaddle = false;
    ball.body.velocity.y = -300;
    ball.body.velocity.x = -75;
    ball.animations.play('spin');
    introText.visible = false;
  }

}

function ballLost() {

  lives--;
  livesText.text = 'lives: ' + lives;

  if (lives === 0) {
    gameOver();
  } else {
    ballOnPaddle = true;

    ball.reset(paddle.body.x + 16, paddle.y - 16);

    ball.animations.stop();
  }

}

function gameOver() {

  ball.body.velocity.setTo(0, 0);

  introText.text = 'Game Over!';
  introText.visible = true;

}

function ballHitdrug(_ball, _drug) {

  _drug.kill();

  score += 10;

  scoreText.text = 'score: ' + score;

  //  Are they any drugs left?
  if (drugs.countLiving() == 0) {
    //  New level starts
    score += 1000;
    scoreText.text = 'score: ' + score;
    introText.text = '- Next Level -';

    //  Let's move the ball back to the paddle
    ballOnPaddle = true;
    ball.body.velocity.set(0);
    ball.x = paddle.x + 16;
    ball.y = paddle.y - 16;
    ball.animations.stop();

    //  And bring the drugs back from the dead :)
    drugs.callAll('revive');
  }

}

function ballHitPaddle(_ball, _paddle) {

  var diff = 0;

  if (_ball.x < _paddle.x) {
    //  Ball is on the left-hand side of the paddle
    diff = _paddle.x - _ball.x;
    _ball.body.velocity.x = (-10 * diff);
  } else if (_ball.x > _paddle.x) {
    //  Ball is on the right-hand side of the paddle
    diff = _ball.x - _paddle.x;
    _ball.body.velocity.x = (10 * diff);
  } else {
    //  Ball is perfectly in the middle
    //  Add a little random X to stop it bouncing straight up!
    _ball.body.velocity.x = 2 + Math.random() * 8;
  }

}
