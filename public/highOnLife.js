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

  //  Firefox doesn't support mp3 files, so use ogg
  game.load.audio('boden', ['assets/audio/main.mp3', 'assets/audio/main.ogg']);

}

var player;

var drugs;

var lives = 3;
var score = 0;

var scoreText;
var livesText;
var timeText;

var playTime = 2; //in minutes
var currentTime = "1:00";

var drugTypes = ["meth", "weed", "lsd", "cocaine"];

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
  music.play();

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

  player.scale.setTo(2, 2);

  // NOTE: Score Text Setup

  scoreText = game.add.text(32, 550, 'score: 0', {
    font: "20px Arial",
    fill: "#ffffff",
    align: "left"
  });
  timeText = game.add.text(game.world.centerX - 110, 10, 'Time Left ' + currentTime, {
    font: "40px Arial",
    fill: "#ffffff",
    align:"center"
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

  moving = false;

  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && player.x > 0) {
    player.x -= speed;
    player.play('left');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) && player.x < screen.w) {
    player.x += speed;
    player.play('right');
    moving = true;
  }

  if (game.input.keyboard.isDown(Phaser.Keyboard.UP) && player.y > 0) {
    player.y -= speed;
    player.play('up');
    moving = true;
  } else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && player.y < screen.h) {
    player.y += speed;
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
  speed = 100;
}

function weedEffect() {
  speed = 2;
}

function lsdEffect() {
  speed = 5;
}

function cocaineEffect() {
  speed = 14;
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
