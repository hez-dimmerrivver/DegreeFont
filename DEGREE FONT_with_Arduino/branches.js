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
    this.anomaly=anomaly;
  }

  ///////////update////////////////////////////////////////////
  update() {
    // Increase age of this tendril
    this.age += 1;

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
    let fire=map(this.anomaly,-0.2,0.8,100,0)
    let fire2=map(this.anomaly,-0.2,0.8,0,100)
    //outer branch
    push()
    strokeWeight(0.6);
    stroke(120+fire2*1.8, 190-fire2*2, 70-fire2*1.5, 90);
    line(this.prevX, this.prevY, this.x, this.y); // draw the movement line from previous to current position
     pop()
    
    push()
    fill(255,random(50,140)+this.age*0.7,30+fire2*0.5,0+this.age*0.5-fire*1.6)
    noStroke()
    circle(this.x, this.y,8-this.age*0.05)
    pop()
    
    //structure
    push()
    strokeWeight(0.6);
    stroke(25+fire2*2, 90-fire2*0.1, 40-fire2);
    line(this.prevX2, this.prevY2, this.x2, this.y2);
    pop()
       
    push()
    fill(255,random(150,230)+fire2*0.5,120+fire2*0.5,0+this.age*0.5-fire*1.9)
    noStroke()
    circle(this.x2, this.y2,9-this.age*0.05)
    pop()
  }
}
