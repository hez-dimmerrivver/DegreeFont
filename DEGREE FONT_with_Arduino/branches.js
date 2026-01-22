/*
Main Reference:
1.Jeff Thompson_CP1: Object-Oriented Programming in P5JS – Random Growth
https://www.youtube.com/watch?v=WpzdIwYnSS0
*/

class Branches {
  ///////////constructor////////////////////////////////////////////
  constructor(x, y, angle, anomaly=0) {
    this.angleChangeAmt = radians(6); // how much the angle can change each frame
    this.speed = 0.2;
    this.speed2 = 0.04; // how fast the fungus moves
    this.chanceSplit = 1.2; // chance of splitting each frame
    this.splitAngle = radians(15); // angle at which new fungi split

    // passed in from the arguments
    this.x = x;
    this.x2 = x;
    this.y = y;
    this.y2 = y;
    this.prevX = x;
    this.prevX2 = x;
    this.prevY = y;
    this.prevY2 = y;

    // if the angle variable is passed in, use that, otherwise set to a random angle
    this.angle = angle || random(0, TWO_PI);

    // variables updated every frame
    this.age = 0;
    this.lifespan = 250;
    this.anomaly=anomaly;
  }

  ///////////update////////////////////////////////////////////
  update() {
    // Increase age of this tendril
    this.age += 1;
    this.lifespan -= 2.0;

    // Move in a random direction
    this.angle += random(-this.angleChangeAmt, this.angleChangeAmt); // Slight random change in direction
    this.prevX = this.x;
    this.prevX2 = this.x2;
    this.prevY = this.y;
    this.prevY2 = this.y2;

    // Move the fungus object by speed in the direction of the angle
    this.x += cos(this.angle) * this.speed;
    this.y += sin(this.angle) * this.speed;
    this.x2 += cos(this.angle) * this.speed2;
    this.y2 += sin(this.angle) * this.speed2;


    if (this.age > 40) {
      return;
    } 

    // Randomly split into two Fungus objects
    if (random(100) < this.chanceSplit) {
      let f = new Branches(this.x, this.y, this.angle + this.splitAngle);
      branch.push(f); // Add new fungus to the branch array
      this.angle -= this.splitAngle; // Change angle for the current branches
    }
  }

  ///////////display////////////////////////////////////////////
  display() {
    let fireAlpha = map(this.anomaly, 0, 0.8, 0, 80, true);
    let currentAlpha = (this.lifespan / 100) * (fireAlpha * 0.1);
    
    //outer branch & fire
    push()
    let r = 140+fireAlpha*3.5;
    let g = 170-fireAlpha*3;
    let b = 90-fireAlpha*1.5;    
    strokeWeight(0.6);
    stroke(r, g, b, 90);
    line(this.prevX, this.prevY, this.x, this.y); 
    pop() 
    
    push()
    let fireR = random(220,255)
    let fireG = random(130,240)-fireAlpha
    let fireB = 100-fireAlpha
    let fireSize = random(5,15)-this.age*0.03
    fill(fireR,fireG, fireB, currentAlpha)
    noStroke()
    circle(this.x, this.y,fireSize)
    pop()
    
    //structure branch & fire
    push()
    let r2 = 20+fireAlpha*4
    let g2 = 100-fireAlpha*2
    let b2 = 30-fireAlpha*1
    strokeWeight(0.6);
    stroke(r2,g2,b2);
    line(this.prevX2, this.prevY2, this.x2, this.y2);
    pop()
    
    push()
    let fireR2 = 255
    let fireG2 = 255-fireAlpha*0.3
    let fireB2 = 200-fireAlpha*0.3
    let fireSize2 = random(0,12)
    fill(fireR2,fireG2, fireB2, currentAlpha)
    noStroke()
    circle(this.x2, this.y2,fireSize2)
    pop()
       
  }
}
