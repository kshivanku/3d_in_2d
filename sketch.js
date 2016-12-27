var playerSize = 60;
var baseBarrierSpeed = 2;
var maxBarrierSpeed = 20;
var barrierSpeed = baseBarrierSpeed;
var lastBarrierSpeed;
var barrierMinBreath = 1;
var barrierMaxBreath = 400;
var min_dist = 200;
var max_dist = 300;
var score = 0;
var practiceScore = 1;
var topScore;
var barrierColor = "#FFFFFF";
var barrierTopColor = "#FFFFFF";
var barrierBottomColor = "#FFFFFF";
var playerColor = "#191C21";
var playerBottomColor = "#191C21";
var playerTopColor = "#191C21";
var shadowColor;
var shadowOffset = 10;
var slow = false;
var speedChanged = false;
var deducted = false;

// all the coordinates for the player tx1,sy1,
var tx, ty, sy, sx, rawtx1, rawsy1, restart;
var tplayer;
var splayer;
var barrier = [];

var t_collision = false;
var s_collision = false;

var serial; // variable to hold an instance of the serialport library
var portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here
var amt = 0.05;
var smoothedValue = 0;
var outByte = 'x';

var index;
var c1,c2,backgroundColor;

var songOut;

function preload(){
	songOut = loadSound("SciFi-06.mp3");
}

function setup() {
  createCanvas(window.innerHeight * 2, window.innerHeight);
  barrier[0] = new Barrier();
  shadowColor = color(0, 120);
  tx = width / 8;
  sy = 3 * height / 4;
  smooth(); // antialias drawing lines
  serial = new p5.SerialPort(); // make a new instance of the serialport library
  serial.on('open', portOpen);
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.open(portName);
  // pixelDensity(1);
  c1 = color('#7655EA');
  c2 = color('#1DA5E1');
  backgroundColor = color('#F4EFDC');
} //SETUP ENDS

function draw() {
  background(backgroundColor);  
  
  for (var i = 0; i <= height; i++) {
    var inter = map(i, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(width/2, i, width, i);
  }
  
  ty = height - playerSize;
  sx = playerSize + width / 2;
  tplayer = new Player();
  splayer = new Player();


  displayFirstBarrierAndPlayer();
  for (i = 1; i < barrier.length; i++) {
    fill(barrierColor);
    noStroke();
    barrier[i].display();
  }

  checkBarrierSpeed();
  for (i = 0; i < barrier.length; i++) {
    barrier[i].tmove();
    barrier[i].smove();
  }

  deletionCheck(barrier);
  additionCheck(barrier);
  collisionCheck(barrier, tplayer, splayer);
  
  displayScore();
} //DRAW ENDS


function displayScore() {
  stroke(barrierColor);
  line((width - height), 0, (width - height), height);
  fill(255, 220);
  noStroke();
  rectMode(CENTER);
  rect(width / 2, 25, 250, 50);
  fill(0);
  textSize(16);
  textAlign(CENTER);
  textStyle(BOLD);
  if(topScore){
  	text("Score: " + score + "    Best: " + topScore, width / 2, 30);
  }
  else{
  	text("Score: " + score, width / 2, 30);
  }
  
  textSize(12);
  textStyle(NORMAL);
  text("TOP VIEW", 80, 30);
  text("SIDE VIEW", width - 90, 30);
  
  rectMode(CORNER);
}

function displayFirstBarrierAndPlayer() {
  noStroke();
  if (barrier[0].id == "TOP_BACK") {
    tplayer.tdisplay();
    barrier[0].display();
    splayer.sdisplay();
  } else if (barrier[0].id == "TOP_FRONT") {
    tplayer.tdisplay();
    splayer.sdisplay();
    barrier[0].display();
  } else if (barrier[0].id == "BOTTOM_FRONT") {
    splayer.sdisplay();
    barrier[0].display();
    tplayer.tdisplay();
  } else if (barrier[0].id == "BOTTOM_BACK") {
    barrier[0].display();
    tplayer.tdisplay();
    splayer.sdisplay();
  }
}

// CHECKING FOR COLLISION
function collisionCheck(b, t, s) {

  // TOP VIEW

  var topXCollision = TopViewBarrierInXRange(b, t);
  var topYCollision = TopViewBarrierInYRange(b, t);

  if (topXCollision && topYCollision) {
    t_collision = true;
  } else {
    t_collision = false;
  }

  // SIDE VIEW

  var sideXCollision = SideViewBarrierInXRange(b, s);
  var sideYCollision = SideViewBarrierInYRange(b, s);

  if (sideXCollision && sideYCollision) {
    s_collision = true;
  } else {
    s_collision = false;
  }

  if (t_collision && s_collision) {
    outByte = "H";
    turnEverythingRed();
    songOut.play();
    noLoop();
    if (score > topScore || !topScore) {
      topScore = score;
    }
  }
} //COLLISION CHECK ENDS

function turnEverythingRed(){
	c1 = color('#931111');
  c2 = color('#600000');
  barrierColor = "#BF1616";
	barrierTopColor = "#BF1616";
	barrierBottomColor = "#BF1616";
	playerColor = "#FFFFFF";
	playerBottomColor = "#FFFFFF";
	playerTopColor = "#FFFFFF";

  background('#790000');
  
  for (var i = 0; i <= height; i++) {
    var inter = map(i, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(width/2, i, width, i);
  }
  
  displayFirstBarrierAndPlayer();
  for (i = 1; i < barrier.length; i++) {
    fill(barrierColor);
    noStroke();
    barrier[i].display();
  }
}


function TopViewBarrierInXRange(b, t) {
  var TopPlayerXbegin = t.txpos - playerSize / 2;
  var TopPlayerXend = TopPlayerXbegin + playerSize;
  var xOnBarrier;

  for (i = 0; i < b[0].length; i++) {
    txOnBarrier = b[0].txpos + i;
    if (txOnBarrier >= TopPlayerXbegin && txOnBarrier <= TopPlayerXend) {
      return true;
    }
  }
}

function TopViewBarrierInYRange(b, t) {
  var TopPlayerYbegin = t.typos - playerSize / 2;
  var TopPlayerYend = TopPlayerYbegin + playerSize;
  var tyOnBarrier;

  for (i = 0; i < b[0].breath; i++) {
    tyOnBarrier = b[0].typos + i;
    if (tyOnBarrier >= TopPlayerYbegin && tyOnBarrier <= TopPlayerYend) {
      return true;
    }
  }
}

function SideViewBarrierInXRange(b, s) {
  var SidePlayerXbegin = s.sxpos - playerSize / 2;
  var SidePlayerXend = SidePlayerXbegin + playerSize;
  var sxOnBarrier;

  for (i = 0; i < b[0].breath; i++) {
    sxOnBarrier = b[0].sxpos + i;
    if (sxOnBarrier >= SidePlayerXbegin && sxOnBarrier <= SidePlayerXend) {
      return true;
    }
  }
}

function SideViewBarrierInYRange(b, s) {
  var SidePlayerYbegin = s.sypos - playerSize / 2;
  var SidePlayerYend = SidePlayerYbegin + playerSize;
  var syOnBarrier;

  for (i = 0; i < b[0].height; i++) {
    syOnBarrier = b[0].sypos + i;
    if (syOnBarrier >= SidePlayerYbegin && syOnBarrier <= SidePlayerYend) {
      return true;
    }
  }
}

function deletionCheck(b) {
  if (b[0].typos > height) {
    b.splice(0, 1);
  }
}

function additionCheck(b) {
  var distance = floor(random(min_dist, max_dist));
  if (b[b.length - 1].typos >= distance) {
    new_barrier = new Barrier();
    b.push(new_barrier);
  }
}

function checkBarrierSpeed() {
  if (slow) {
  	barrierSpeed = baseBarrierSpeed;
    score -= 2;
  } else {
    if(barrierSpeed < maxBarrierSpeed){
	  	barrierSpeed = barrierSpeed + 0.1;
    }
    else{
    	barrierSpeed = maxBarrierSpeed;
    }
    score += 1;
  }
}

function restartGame() {
  barrier.splice(0, 1);
  score = 0;
  barrierSpeed = baseBarrierSpeed;
  if (!barrier[0]) {
    barrier[0] = new Barrier();
  }
  resetColors();
  loop();
}

function resetColors(){
	barrierColor = "#FFFFFF";
	barrierTopColor = "#FFFFFF";
	barrierBottomColor = "#FFFFFF";
	playerColor = "#191C21";
	playerBottomColor = "#191C21";
	playerTopColor = "#191C21";
  c1 = color('#7655EA');
  c2 = color('#1DA5E1');
  backgroundColor = color('#F4EFDC');
}

function Player() {
  //Top view
  this.txpos = tx;
  this.typos = ty;
  //Side view
  this.sxpos = sx;
  this.sypos = sy;
  this.tdisplay = function() {
    
    if (splayer.sypos < height / 2) {
      fill(shadowColor);
      ellipse(this.txpos, this.typos + shadowOffset, playerSize, playerSize);
      fill(playerTopColor);
      ellipse(this.txpos, this.typos, playerSize, playerSize);
    } else {
      fill(playerBottomColor);
      ellipse(this.txpos, this.typos, playerSize / 1.5, playerSize / 1.5);
    }
  };
  this.sdisplay = function() {
    
    if (splayer.sypos < height / 2) {
      if (tplayer.txpos < width / 4) {
        fill(playerTopColor);
        ellipse(this.sxpos, this.sypos, playerSize / 1.5, playerSize / 1.5);
      } else {
        fill(playerTopColor);
        ellipse(this.sxpos, this.sypos, playerSize, playerSize);
      }
    } else {
      fill(playerBottomColor);
      if (tplayer.txpos < width / 4) {
        ellipse(this.sxpos, this.sypos, playerSize / 1.5, playerSize / 1.5);
      } else {
        ellipse(this.sxpos, this.sypos, playerSize, playerSize);
      }
    }
  };
} //PLAYER ENDS


function Barrier() {
  this.length = chooseBarrierLength();
  this.breath = random(barrierMinBreath, barrierMaxBreath);
  this.height = chooseBarrierHeight(this.length);
  this.txpos = chooseBarriertx(this.length);
  this.typos = (-2) * this.breath;
  this.sxpos = width + (1) * this.breath;
  this.sypos = chooseBarriersy(this.height);

  if (this.txpos === 0 && this.sypos === 0) {
    this.id = "TOP_BACK";
  }
  if (this.txpos == width / 4 && this.sypos === 0) {
    this.id = "TOP_FRONT";
  }
  if (this.txpos === 0 && this.sypos == height / 2) {
    this.id = "BOTTOM_BACK";
  }
  if (this.txpos == width / 4 && this.sypos == height / 2) {
    this.id = "BOTTOM_FRONT";
  }

  this.display = function() {

    if (this.id == "TOP_BACK" || this.id == "TOP_FRONT") {
      fill(barrierTopColor);
    } else {
      fill(barrierBottomColor);
    }
    rect(this.txpos, this.typos, this.length, this.breath);
    rect(this.sxpos, this.sypos, this.breath, this.height);
  };
  this.tmove = function() {
    this.typos += barrierSpeed;
  };
  this.smove = function() {
    if (this.sxpos > (width / 2)) {
      this.sxpos -= barrierSpeed;
    } else {
      this.sxpos = width / 2;
      if (this.breath >= 0) {
        this.breath -= barrierSpeed;
      } else {
        this.sxpos = (-1) * width;
      }
    }
  };
} //BARRIERS ENDS

function chooseBarrierLength() {
  var i = floor(random(0, 2));
  if (i) {
    return width / 2;
  } else {
    return width / 4;
  }
}

function chooseBarrierHeight(l) {
  if (l == width / 2) {
    return height / 2;
  } else {
    var i = floor(random(0, 2));
    if (i) {
      return height;
    } else {
      return height / 2;
    }
  }
}

function chooseBarriertx(l) {
  if (l == width / 2) {
    return 0;
  } else {
    var i = floor(random(0, 2));
    if (i) {
      return width / 4;
    } else {
      return 0;
    }
  }
}


function chooseBarriersy(h) {
  if (h == height) {
    return 0;
  } else {
    var i = floor(random(0, 2));
    if (i) {
      return height / 2;
    } else {
      return 0;
    }
  }
}

function printList(portList) {
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    println(i + " " + portList[i]);
  }
}

function serverConnected() {
  println('connected to server.');
}

function portOpen() {
  println('the serial port opened.');
  serial.write(outByte);
}

function serialError(err) {
  println('Something went wrong with the serial port. ' + err);
}

function portClose() {
  println('The serial port closed.');
}

function serialEvent() {

  // read a string from the serial port
  // until you get carriage return and newline:
  var inString = serial.readStringUntil('\r\n');
  //check to see that there's actually a string there:
  if (inString.length > 0) {
    var sensors = split(inString, ',');
    //split the string on the commas                      
    rawtx1 = map(sensors[0], 250, 400, -5*width, 5*width);
    rawsy1 = map(sensors[1], 250, 400, 5*height, -5*height);
    tx = lerp(tx, rawtx1, amt);
    sy = lerp(sy, rawsy1, amt);
    
    if(tx < width/8) {tx = width/8;}
    if(tx > 3*width/8 - playerSize/2) {tx = 3*width/8 - playerSize/2;}
    if(sy < height/4) {sy = height/4;}
    if(sy > 3*height/4){sy = 3*height/4;}

    if (sensors[3] == "1") {
			slow = false; 			
    }
    else{
    	slow = true;
    }
    
    if (sensors[4] == "1") {
      outByte = "L";
      restartGame();
    }

    serial.write(outByte);
  }
}