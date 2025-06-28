var gameState = 1;
const START = 1;
const PLAY = 2;
const UP = 3;
const END = 4;

var asteroids = [];
var lasers = [];
var viagras = [];
var highScore = 0;
var score = 0;
var level = 0;
var lives = 3;
var ship, SHIP, SIZE, gameOver, GO, levelUp, R, dick;
let restart,
  inputName,
  startButton,
  resetButton,
  openGame,
  s,
  g,
  h,
  shipColor,
  font1,
  font2,
  font3;
let lastShot = 0; // Track the last time a laser was fired
let spacebarHeld = false; // Flag to track if spacebar is held down

// Upgrade UI elements
let Lzr, Spd, Shld, Multi;



async function setup() {
  //fullscreen(true);
  createCanvas(windowWidth, windowHeight);
  
  font1 = await loadFont("/assets/FONT1.otf");
  font2 = await loadFont("/assets/FONT2.otf");
  font3 = await loadFont("/assets/FONT3.otf");
  ASTEROIDS = await loadImage("/assets/ASTEROIDS.png");
  GO = await loadImage("/assets/GO.png");
  SHIP = await loadImage("/assets/ship.png");
  gameOver = await loadImage("/assets/gameOver.png");
  restart = await loadImage("/assets/restart.png");
  levelUp = await loadImage("/assets/levelUp.png");

  
  imageMode(CENTER);
  colorMode(HSB, 200);
  textFont(font1);
  textStyle(BOLD);
  fill(200);
  //SIZE = 20;
  lives = 3;
  ship = new Ship();
  
  // Input for player name
  inputName = createInput("");
  inputName.attribute("placeholder", "Your name?");
  inputName.style("font-size", "25px");
  inputName.position(100, 50);
  inputName.size(200, 50);
  inputName.hide();

  // Choose a ship color.
  shipColor = createSlider(0, 255, 175);
  shipColor.position(100, 250);
  shipColor.style("accent-color", "white");
  shipColor.size(290);
  shipColor.hide();

  // Start game button
  startButton = createButton("START");
  startButton.style("font-size", "35px");
  startButton.size(300, 50);
  startButton.position(100, 450);
  startButton.mousePressed(startGame);
  startButton.hide();

  // Reset game button
  resetButton = createButton("New Game");
  resetButton.position(windowWidth / 2 - 50, height / 2 + 100);
  resetButton.size(100, 30);
  resetButton.mousePressed(reset);
  resetButton.hide();

  // level up button
  lvlUpButton = createImg("/assets/levelUp.png", "LvLUp");
  lvlUpButton.position(windowWidth / 2 - 100, height / 2 - 100);
  lvlUpButton.size(200, 200);
  lvlUpButton.mousePressed(lvlUp);
  lvlUpButton.hide();

  // Upgrade UI elements
  Lzr = createDiv("Laser Strength: " + ship.laserStrength);
  Lzr.position(20, height - 180);
  Lzr.style("color", "orange");
  Lzr.hide();

  Spd = createDiv("Ship Speed: " + ship.speedMultiplier);
  Spd.position(20, height - 150);
  Spd.style("color", "red");
  Spd.hide();

  Shld = createDiv("Shield: " + ship.shield);
  Shld.position(20, height - 120);
  Shld.style("color", "blue");
  Shld.hide();

  Multi = createDiv("Multi Laser: " + ship.multiShot);
  Multi.position(20, height - 90);
  Multi.style("color", "green");
  Multi.hide();

  // Initialize high score from localStorage
  if (localStorage.highScore) {
    highScore = localStorage.highScore;
  } else {
    localStorage.highScore = highScore;
  }

  // Show start screen
  if (gameState === START) {
    inputName.show();
    startButton.show();
    shipColor.show();
  }
}

function draw() {
  background(0);

  if (gameState === START) {
    // Display start screen
    push();
    fill(shipColor.value(), 200, 200);
    stroke(0);
    rect(100, 240, 300, 40);
    textSize(50);

    text("PICK a COLOR", 100, 200);
    text("PUSH START to PLAY", 100, 400);
    textSize(50);
    pop();
    push();
    fill(shipColor.value(), 200, 200);
    dick(650,200, 0.03, 1.7);
    pop();
    
  } else if (gameState === PLAY) {
    shipColor.hide();
    resetButton.hide();
    textFont(font3);
    textSize(30);
    text("" + playerName, windowWidth / 2, 50);
    textSize(30);
    text("HighScore: " + highScore, 50, 50);
    text("Score: " + score, 50, 80);
    text("Level: " + level, 50, 110);
    push();
    if (lives > 0) {
      for (let d = 0; d < lives; d++) {
        push();
        dick(windowWidth - 70 - d * 50, 60, 0, 1);
        pop();
      }
    }
    pop();

    if (asteroids.length < 1) {
      gameState = UP;
      level += 1;
      //ass(level);
      upgradeShip(); // Trigger upgrade
    } else {
      for (var i = asteroids.length - 1; i >= 0; i--) {
        asteroids[i].render();
        asteroids[i].update();
        asteroids[i].edges();
        let hitResult = ship.hits(asteroids[i]);
        if (hitResult === 'asteroid') {
          asteroids.splice(i, 1);
          lives--;
          if (lives <= 0) {
            level = 1;
            gameState = END;
          }
        } else if (hitResult === 'shielded') {
          asteroids.splice(i, 1); // Asteroid is destroyed by shield impact
        }
      }

      for (var j = lasers.length - 1; j >= 0; j--) {
        lasers[j].render();
        lasers[j].update();
        if (lasers[j].offscreen()) {
          lasers.splice(j, 1);
        } else {
          for (var i = asteroids.length - 1; i >= 0; i--) {
            if (lasers[j].hits(asteroids[i])) {
              score += 1;
              lasers.splice(j, 1);
              asteroids[i].H -= (1 + ship.laserStrength);
              if (asteroids[i].H < 1) {
                if (asteroids[i].r > constrain(20-level,10, 20)) {
                  var newAsteroids = asteroids[i].breakup();
                  asteroids = asteroids.concat(newAsteroids);
                }
                asteroids.splice(i, 1);
              }
              break;
            }
          }
        }
      }
    }

    ship.render();
    ship.turn();
    ship.update();
    ship.edges();
    console.log(keyCode);
    if (keyIsPressed === false) {
      ship.setRotation(0);
      ship.boosting(false);
    }


//     // Spawn Viagra periodically (e.g., every few levels or based on a timer)
//     // Here's an example: spawn one Viagra if there are none and the level is even
//     // You might want a more sophisticated spawning mechanism (e.g., random chance)
    if (viagras.length === 0 && level >= 2 && score % 200 === 0) {
      viagras.push(new Viagra());
    }
    for (let k = viagras.length - 1; k >= 0; k--) {
      viagras[k].render();
      viagras[k].update();
      viagras[k].edges();
      let vCollected = ship.eats(viagras[k]);
      if (vCollected === 'viagra') {
        viagras.splice(k, 1); // Remove Viagra after collection
      }
    } 


  } else if (gameState === UP) {
    if (localStorage.highScore < score) {
      localStorage.highScore = score;
      highScore = score;
    }
    lvlUpButton.show();
  } else if (gameState === END) {
    if (score > highScore) {
      highScore = score;
      localStorage.highScore = highScore;
    }
    text("HighScore: " + highScore, 50, 50);
    text("Score: " + score, 50, 80);

    image(gameOver, windowWidth / 2, 190);
    resetButton.show();
  }
}

function startGame() {
  playerName = inputName.value();
  inputName.hide();
  startButton.hide();
  gameState = PLAY;
}

function lvlUp() {
  playerName = inputName.value();
  inputName.hide();
  startButton.hide();
  lvlUpButton.hide();
  lasers.splice(0, lasers.length);
  asteroids.splice(0, asteroids.length);
  for (var i = 0; i < level * 3; i++) {
    asteroids.push(new Asteroid());
  }
  gameState = PLAY;
}

function keyPressed() {
  if (key === " ") { 
    if (ship.multiShot === 1) { //fire a single laser straight ahead
      lasers.push(new Laser(ship.pos, ship.heading, ship.laserStrength));
    } else { //fire multi-angle shot
      let spreadAngle = PI / 9; // value to control spread angle : PI/ (lower for wider)
      let numLasers = ship.multiShot;
      let startAngle =
        ship.heading - ((numLasers - 1) / 2) * (spreadAngle / (numLasers - 1 || 1));
      for (let i = 0; i < numLasers; i++) {
        let currentAngle =
          startAngle + i * (spreadAngle / (numLasers - 1 || 1));
        lasers.push(new Laser(ship.pos, currentAngle, ship.laserStrength));
      }
    }
  }
  
  // Movement controls
  if (keyCode === 39) { //rotate right
    ship.setRotation(-0.09);
  } else if (keyCode === 37) { //rotate left
    ship.setRotation(0.09);
  } else if (keyCode === 38) { //forward
    ship.boosting(true);
  }
}
function keyReleased() {
   if (keyCode === 39) { //rotate right
    ship.setRotation(0);
  } else if (keyCode === 37) { //rotate left
    ship.setRotation(0);
  } else if (keyCode === 38) { //forward
    ship.boosting(false);
  }
}
function reset() { //Clear arrays, reset ship size
  gameState = PLAY;
  level = 1;
  score = 0;
  lives = 3;
  asteroids = [];
  lasers = [];
  // viagras = []; // Clear the viagras array on reset
  // SIZE = 20; // Reset ship size

  ship = new Ship();
  
  Lzr.hide();
  Spd.hide();
  Shld.hide();
  Multi.hide();
  Lzr.html("Laser Strength: 1");
  Spd.html("Ship Speed: 1");
  Shld.html("Shield: 0");
  Multi.html("Multi Laser: 1");
}

function upgradeShip() {
  let upgrade = floor(random(5)); // Randomly choose an upgrade
  switch (upgrade) {
    case 0:
      ship.laserStrength += 2; // Stronger lasers
      Lzr.html("Laser Strength: " + ship.laserStrength);
      Lzr.show();
      console.log("Upgrade: Stronger Lasers");
      break;
    case 1:
      ship.speedMultiplier += 0.5; // Faster movement
      Spd.html("Ship Speed: " + ship.speedMultiplier);
      Spd.show();
      console.log("Upgrade: Faster Movement");
      break;
    case 2:
      ship.shield += 3; // Add shield
      Shld.html("Shield: " + ship.shield);
      Shld.show();
      console.log("Upgrade: Shield Added");
      break;
    case 3:
      ship.multiShot += 1; // Multi-shot
      Multi.html("Multi Laser: " + ship.multiShot);
      Multi.show();
      console.log("Upgrade: Multi-shot");
      break;
  }
}

function dick(x, y, z, s) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.s = s;

  translate(this.x, this.y);
  rotate(frameCount * this.z);
  scale(this.s);
  ellipse(0, 50, 20, 20);
  rect(-10, -10, 20, 60);
  ellipse(-10, -10, 20, 20);
  ellipse(10, -10, 20, 20);
  line(0, 55, 0, 70);
}
// function shield() {
//   push();
//   stroke(200, 200, 200, 70);
//   ellipse(0, 0, 50, 100);
//   pop();
// }
