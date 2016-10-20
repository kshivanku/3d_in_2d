var playerSize = 25;
var trigger = false;
var speed = 15;
var tx1,tx2,ty,sy1,sy2,sx;
var tplayer;
var splayer;

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
}

function draw() {
  background(220);
  line((width - height), 0, (width - height), height);

  if (trigger) {
  	keyPressed();
  }
  tplayer.tdisplay();
  splayer.sdisplay();
}

function Player() {
  this.txpos = tx1;
  this.typos = ty;
  this.tdisplay = function() {
    ellipse(this.txpos, this.typos, playerSize, playerSize);
  };
  this.sxpos = sx;
  this.sypos = sy1;
  this.sdisplay = function() {
    ellipse(this.sxpos, this.sypos, playerSize, playerSize);
  };
}

function keyPressed() {
  trigger = true;
  if (keyCode == 37 && tplayer.txpos >= tx1) {
    tplayer.txpos -= speed;
  }
  else if (keyCode == 39 && tplayer.txpos <= tx2){
  	tplayer.txpos += speed;
  }
  else if (keyCode == 38 && splayer.sypos >= sy2){
  	splayer.sypos -= speed;
  }
  else if (keyCode == 40 && splayer.sypos <= sy1){
  	splayer.sypos += speed;
  }
  else {
    trigger = false;
  }
}