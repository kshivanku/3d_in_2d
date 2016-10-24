var playerSize = 40;
var trigger = false;
var playerSpeed = 18;
var baseBarrierSpeed=5;
var maxBarrierSpeed = 14;
var barrierSpeed = baseBarrierSpeed;
var lastBarrierSpeed;
var barrierMinBreath = 1;
var barrierMaxBreath = 100;
var min_dist = 250;
var max_dist = 1000;
var score = 0;
var practiceScore = 10;
var topScore = 0;
var barrierColor = "#606060";
var playerColor = "#E60909";
var slow = false;

// all the coordinates for the player
var tx1, tx2, ty, sy1, sy2, sx;
var tplayer;
var splayer;
var barrier = [];

var t_collision = false;
var s_collision = false;

function setup() {
  createCanvas(window.innerHeight * 2, window.innerHeight);
  tx1 = width / 8;
  tx2 = 3 * width / 8;
  ty = height - playerSize;
  sy1 = 3 * height / 4;
  sy2 = height / 4;
  sx = playerSize + width / 2;
  tplayer = new Player();
  splayer = new Player();
  barrier[0] = new Barrier();
} //SETUP ENDS

function draw() {
  background(220);
    
  displayFirstBarrierAndPlayer();

  for (i = 1; i < barrier.length; i++) {
    fill(barrierColor);
    noStroke();
    barrier[i].display();
  }

  displayScore();

  checkBarrierSpeed();
  for (i = 0; i < barrier.length; i++) {
    barrier[i].tmove();
    barrier[i].smove();
  }

  if (trigger || keyIsPressed) {
    movePlayer();
  }

  deletionCheck(barrier);
  additionCheck(barrier);
  collisionCheck(barrier, tplayer, splayer);
} //DRAW ENDS


function displayScore(){
  stroke(barrierColor);
  line((width - height), 0, (width - height), height); 
  fill(255);
  rect(width/2 - 125, 0, 250, 50 );
  fill(0);
  textSize(16);
  text("Score: " + score, width/2 - 105, 30);
  text("Top Score: " + topScore, width/2 + 10, 30);
}

function displayFirstBarrierAndPlayer(){
  noStroke();
  if(barrier[0].id=="TOP_BACK"){
    tplayer.tdisplay();
    barrier[0].display();
    splayer.sdisplay();
  }
  else if(barrier[0].id == "TOP_FRONT"){
    tplayer.tdisplay();
    splayer.sdisplay(); 
    barrier[0].display();
  }
  else if(barrier[0].id == "BOTTOM_FRONT"){
    splayer.sdisplay();
    barrier[0].display();
    tplayer.tdisplay(); 
  }
  else if(barrier[0].id == "BOTTOM_BACK"){
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
    noLoop();
    if (score> topScore){
      topScore = score;
    }
  }
} //COLLISION CHECK ENDS

function TopViewBarrierInXRange(b, t) {
  var TopPlayerXbegin = t.txpos - playerSize / 3;
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
  var TopPlayerYbegin = t.typos - playerSize / 3;
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
  var SidePlayerXbegin = s.sxpos - playerSize / 3;
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
  var SidePlayerYbegin = s.sypos - playerSize / 3;
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
    score += 1;
  }
}

function additionCheck(b) {
  var distance = floor(random(min_dist, max_dist));
  if (b[b.length - 1].typos >= distance) {
    new_barrier = new Barrier();
    b.push(new_barrier);
  }
}

function mousePressed(){
  barrier.splice(0,1);
  score = 0;
  barrierSpeed = baseBarrierSpeed;
  loop();
}


function Player() {
  //Top view
  this.txpos = tx1;
  this.typos = ty;
  //Side view
  this.sxpos = sx;
  this.sypos = sy1;
  this.tdisplay = function() {
    fill(playerColor);
    ellipse(this.txpos, this.typos, playerSize, playerSize);
  };
  this.sdisplay = function() {
    fill(playerColor);
    ellipse(this.sxpos, this.sypos, playerSize, playerSize);
  };
} //PLAYER ENDS

function movePlayer() {
  trigger = true;
  if (keyCode == 37 && tplayer.txpos >= tx1) {
    tplayer.txpos -= playerSpeed;
  } else if (keyCode == 39 && tplayer.txpos <= tx2) {
    tplayer.txpos += playerSpeed;
  } else if (keyCode == 38 && splayer.sypos >= sy2) {
    splayer.sypos -= playerSpeed;
  } else if (keyCode == 40 && splayer.sypos <= sy1) {
    splayer.sypos += playerSpeed;
  } else {
    trigger = false;
  }
}

// Controlling barrier speed
function keyPressed(){
  if(keyCode == 32){
    if(!slow){
      lastBarrierSpeed = barrierSpeed;
      barrierSpeed = 2;
      slow = true;
      score -= 10; 
    }
    else{
      barrierSpeed = lastBarrierSpeed;
      slow = false;
    }
  }
}

function checkBarrierSpeed(){
  if(!slow && score > practiceScore){
    if(barrierSpeed < maxBarrierSpeed){
      barrierSpeed = barrierSpeed + score * 0.0005;
    }
    else{
      barrierSpeed = maxBarrierSpeed;
    }
  }
}

function Barrier() {
  this.length = chooseBarrierLength();
  this.breath = random(barrierMinBreath, barrierMaxBreath);
  this.height = chooseBarrierHeight(this.length);
  this.txpos = chooseBarriertx(this.length);
  this.typos = (-2) * this.breath;
  this.sxpos = width + (1) * this.breath;
  this.sypos = chooseBarriersy(this.height);
  
  if(this.txpos==0 && this.sypos==0 ){ this.id = "TOP_BACK";}
  if(this.txpos==width/4 && this.sypos==0 ){ this.id = "TOP_FRONT";}
  if(this.txpos==0 && this.sypos==height/2 ){ this.id = "BOTTOM_BACK";}
  if(this.txpos==width/4 && this.sypos==height/2 ){ this.id = "BOTTOM_FRONT";}

  this.display = function() {
    fill(barrierColor);
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