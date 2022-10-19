var chunks = [];
var button;
var canvas;
let ball;
let tennisballs = [];
let bone;
let DogBone = []; // DogBone, dogBone, dogBones
var w = window.innerWidth;

let c1,c2;

// let brinkley;
// let Brinkley = [];
class Tennisball {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = random(-15, 30);
    this.xdir = random(-1, 1);
    this.ydir = random(-1, 1);
  }
  move() {
    this.x = this.x + this.xdir;
    this.y = this.y + this.ydir;
  }
  check() {
    if (this.x > width || this.x < 0) {
      this.xdir = -this.xdir;
    }
    if (this.y > height || this.y < 0) {
      this.ydir = -this.ydir;
    }
  }
  display() {
    image(ball, this.x, this.y, this.size, this.size);
  }
}
class DogBones {
  constructor() {
    this.x = random(0, width);
    this.y = random(0, height);
    this.size = random(-15, 30);
    this.xdir = random(-1, 1);
    this.ydir = random(-1, 1);
  }
  move() {
    this.x = this.x + this.xdir;
    this.y = this.y + this.ydir;
  }
  check() {
    if (this.x > width || this.x < 0) {
      this.xdir = -this.xdir;
    }
    if (this.y > height || this.y < 0) {
      this.ydir = -this.ydir;
    }
  }
  display() {
    image(bone, this.x, this.y, this.size, this.size);
  }
  pressed() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.size - 10) {
      this.xdir = 0;
      this.ydir = 0;
    }
  }

}

function preload() {
  ball = loadImage("images/mustache.png");
  bone = loadImage("images/star.png");
  // brinkley = loadImage("Brinkley.png");
}

function setup() {
  canvas = createCanvas(window.innerWidth-30, 600);
  c1 = color(47, 147, 175);
  c2 = color(47, 147, 175);
  for (let i = 0; i < 100; i++) {
    let myTennisball = new Tennisball();
    tennisballs.push(myTennisball);
  }
  for (let i = 0; i < 100; i++) {
    let myDogBones = new DogBones();
    DogBone.push(myDogBones);
  }
  showDivs(1)
}



function draw() {
for(let y=0; y<height+1; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c2,c1,n);
    stroke(newc);
    line(0,y,width, y);
  
}

fill(255);
  text("Multi-User Photobooth", windowWidth/3, 300);
  textSize(50);
  textFont('Source Sans Pro');

 

  
  for (let i = 0; i < 100; i++) {
    let obj = tennisballs[i];
    obj.move();
    obj.check();
    obj.display();
  }
  for (let i = 0; i < 100; i++) {
    let obj = DogBone[i];
    obj.move();
    obj.check();
    obj.display();
  }
//   image(brinkley, mouseX - 45, mouseY - 60, 70, 120);
// 
}
function windowResized() {
  resizeCanvas(windowWidth-20, 600);
}


function mousePressed() {
  for (let i = 0; i < 100; i++) {
    let obj = DogBone[i];
    obj.pressed();
  }
 
  }
  var slideIndex = 1;
showDivs(slideIndex);

function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) {slideIndex = 1 }
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}



