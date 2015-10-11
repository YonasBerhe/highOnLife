var screen = {
  w: window.innerWidth,
  h: window.innerHeight,
};

var game = new Phaser.Game(screen.w, screen.h, Phaser.AUTO, 'highOnLife', {
  preload: preload,
  create: create,
  update: update
});


function preload() {
  console.log("PRELOAD");

  game.load.atlas('breakout', '/assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');

  game.load.image('starfield', '/assets/bg/starfield.jpg');

  game.load.spritesheet('player', 'assets/sprites/spaceman.png', 16, 16);

  game.load.spritesheet('cabinet', 'assets/sprites/cabinet.png', 35, 54);

  game.load.spritesheet('open_cabinet', 'assets/sprites/open_cabinet.png', 33, 58);

  game.load.spritesheet('garbage', 'assets/sprites/garbage.png', 34, 30);

  game.load.spritesheet('ironing_board', 'assets/sprites/ironing_board.png', 88, 38);

  game.load.spritesheet('mjtree', 'assets/sprites/mjtree.png', 66, 57);

  game.load.spritesheet('pan', 'assets/sprites/pan.png', 30, 29);

  game.load.spritesheet('phonebooth', 'assets/sprites/phonebooth.png', 21, 29);

  //  Firefox doesn't support mp3 files, so use ogg
  game.load.audio('boden', ['assets/audio/main.mp3', 'assets/audio/main.ogg']);
  game.load.audio('getdrug',['assets/audio/sfx/drug.mp3','assets/audio/sfx/drug.ogg']);
}

var player;

var cabinet;

var open_cabinet;

var garbage;

var ironing_board;

var mjtree;

var pan;

var phonebooth;

var drugs;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var timeText;

var playTime = 2; //in minutes
var currentTime = "1:00";

var drugTypes = ["meth", "weed", "lsd", "cocaine"];

var druggetsound;
var s;
var music;
var speed = 4;

function create() {
  console.log("CREATE");

  game.physics.startSystem(Phaser.Physics.ARCADE);
  // s = game.add.tileSprite(0, 0, 800, 600, 'starfield');

  game.stage.backgroundColor = '#000000';

  //play music
  music = game.add.audio('boden', true);
  music.loop = true;
  music.play();

  druggetsound = game.add.audio('getdrug', true);

  // NOTE: Drug Setup
  drugs = game.add.group();
  drugs.enableBody = true;
  drugs.physicsBodyType = Phaser.Physics.ARCADE;

  var drug;

  for (var i = 0; i < 8; i++) {
    var num = getRandomInt(1, 4);
    drug = drugs.create(game.world.randomX, game.world.randomY, 'breakout', 'brick_' + num + '_1.png');
    drug.body.bounce.set(1);
    drug.body.immovable = true;
    drug.type = drugTypes[num - 1];
  }

  // NOTE: Player Setup
  player = game.add.sprite(game.world.centerX, game.world.centerY, 'player', 1);
  cabinet = game.add.sprite(game.world.centerX, game.world.centerY, 'cabinet', 1);
  open_cabinet = game.add.sprite(game.world.randomX, game.world.randomY, 'open_cabinet', 1);
  garbage = game.add.sprite(game.world.randomX, game.world.randomY, 'garbage', 1);
  ironing_board = game.add.sprite(game.world.randomX, game.world.randomY, 'ironing_board', 1);
  mjtree = game.add.sprite(game.world.randomX, game.world.randomY, 'mjtree', 1);
  pan = game.add.sprite(game.world.randomX, game.world.randomY, 'pan', 1);
  phonebooth = game.add.sprite(game.world.randomX, game.world.randomY, 'phonebooth', 1);

  left = player.animations.add('left', [8, 9], 10, true);
  right = player.animations.add('right', [1, 2], 10, true);
  player.animations.add('up', [11, 12, 13], 10, true);
  player.animations.add('down', [4, 5, 6], 10, true);

  left.enableUpdate = true;
  right.enableUpdate = true;

  game.physics.enable(player, Phaser.Physics.ARCADE);
  player.body.collideWorldBounds = true;
  player.body.bounce.set(1);

  player.anchor.setTo(0.5, 0.5);

  player.scale.setTo(4, 4);

  // NOTE: Score Text Setup

  scoreText = game.add.text(32, 550, 'score: 0', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });

  startTimer(60 * playTime);

  timeText = game.add.text(game.world.centerX - 110, 10, 'Time Left ' + currentTime, {
    font: "40px Arial",
    fill: "#ffffff",
    align: "center"
  });
  endgameText = game.add.text(game.world.centerX, 400, '- Start Moving! -', {
    font: "40px Arial",
    fill: "#ffffff",
    align: "center"
  });
  endgameText.anchor.setTo(0.5, 0.5);
  startTimer(60 * playTime);

  game.plugins.screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);

  game.plugins.screenShake.setup({
     shakeX: true,
     shakeY: true
    });
}

/**
  Return random Color
*/
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
  // player.body.velocity.set(0);

  moving = false;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.x > 0) {
    player.x -= speed;
    // player.body.velocity.x = -speed;
    player.play('left');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.x < screen.w) {
    player.x += speed;
    // player.body.velocity.x = speed;
    player.play('right');
    moving = true;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.y > 0) {
    player.y -= speed;
    // player.body.velocity.y = -speed;
    player.play('up');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.y < screen.h) {
    player.y += speed;
    // player.body.velocity.y = speed;
    player.play('down');
    moving = true;
  }

  if (moving) {
    game.stage.backgroundColor = getRandomColor();
    playerMoved();
  } else {
    player.animations.stop();
  }

  game.physics.arcade.overlap(player, drugs, playerHitdrug, null, this);

  timeText.text = 'Time Left: ' + currentTime;

}

function gameOver() {
  console.log('Called gameOver');
  // endgameText.text = "- Game Over! -";
  // endgameText.visible = true;

  // TODO: add end of game shit


}

function playerHitdrug(_player, _drug) {
  console.log('Collision!');
  console.log(_drug.type);
  _drug.kill();

  score += 10;

  scoreText.text = 'score: ' + score;
  druggetsound.play();
  //Shake camera
  game.plugins.screenShake.shake(100);

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

// Drug Effects

function methEffect() {
  speed = 1800;
}

function weedEffect() {
  speed = 1000;
}

function lsdEffect() {
  speed = 450;
}

function cocaineEffect() {
  speed = 900;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function playerMoved() {
  endgameText.visible = false;
}

var outOfTime = false;
// timer function
function startTimer(duration) {
  var timer = duration,
    minutes, seconds;

  setInterval(function() {
    if (!outOfTime) {
      console.log("EI RUNNING!!");
      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      currentTime = minutes + ":" + seconds;

      if (--timer < 0) {
        // timer = duration;
        console.log("done!");
        outOfTime = true;
        gameOver();
      }
    }
  }, 1000);
  // }, 1000);
}
