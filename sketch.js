var playerSize = 25;
var trigger = false;
var playerSpeed = 15;
var barrierSpeed = 5;
var barrierMaxBreath = 50;
var min_dist = 250;
var max_dist = 1000;

// all the coordinates for the player
var tx1, tx2, ty, sy1, sy2, sx;

var tplayer;
var splayer;
var barrier = [];

function setup() {
  createCanvas(1040, 520);
  stroke(0);
  fill(0);
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
  line((width - height), 0, (width - height), height);
  if (trigger) {
    keyPressed();
  }
  tplayer.tdisplay();
  splayer.sdisplay();
  
  for (i=0 ; i<barrier.length; i++){
    barrier[i].display();
    barrier[i].tmove();
    barrier[i].smove();
  }
  var oldestBarrier = barrier[0];
  var latestBarrier = barrier[barrier.length - 1]
  deletionCheck(oldestBarrier);
  additionCheck(latestBarrier);
} //DRAW ENDS

function deletionCheck(old){
  if(old.typos > height){
    barrier.slice(1);
  }
}

function additionCheck(latest){
  var distance = floor(random(min_dist, max_dist));
  if (latest.typos >= distance){
    new_barrier = new Barrier();
    barrier.push(new_barrier); 
  }
}

function Player() {
  //Top view
  this.txpos = tx1;
  this.typos = ty;
  //Side view
  this.sxpos = sx;
  this.sypos = sy1;
  this.tdisplay = function() {
    ellipse(this.txpos, this.typos, playerSize, playerSize); 
  };
  this.sdisplay = function(){
    ellipse(this.sxpos, this.sypos, playerSize, playerSize);
  };
} //PLAYER ENDS

function keyPressed() {
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

function Barrier() {
  this.length = chooseBarrierLength();
  this.breath = random(1, barrierMaxBreath);
  this.height = chooseBarrierHeight(this.length);
  this.txpos = chooseBarriertx(this.length);
  this.typos = (-2) * this.breath;
  this.sxpos = width + (1) * this.breath;
  this.sypos = chooseBarriersy(this.height);
  this.display = function() {
    rect(this.txpos, this.typos , this.length, this.breath);
    rect(this.sxpos, this.sypos, this.breath, this.height);
  };
  this.tmove = function(){
    this.typos +=  barrierSpeed;
  };
  this.smove = function(){
    if (this.sxpos > (width/2)){
      this.sxpos -=  barrierSpeed;
    }
    else{
      this.sxpos = width/2;
      if (this.breath >= 0){
        this.breath -= barrierSpeed;
      }
      else{
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
  console.log("Inside height chooser" + "\n");
  if (l == width / 2) {
    console.log("length is width/2 is verified, sending " + height/2);
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

function chooseBarriertx(l){
  if (l == width/2){
    return 0;
  }
  else{
    var i = floor(random(0,2));
    if (i){
      return width/4;
    }
    else { return 0; }
  }
}


function chooseBarriersy(h){
  if(h == height){
    return 0;
  }
  else{
    var i = floor(random(0,2));
    if (i){
      return height/2;
    }
    else { return 0; }
  }
}