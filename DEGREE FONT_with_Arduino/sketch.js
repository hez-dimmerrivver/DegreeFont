/*
Name:°FONT
Date:08 JAN 2026, 
Author: Jiang He Zhang (Hez)

Reference:
1.Jeff Thompson_CP1: Object-Oriented Programming in P5JS – Random Growth
https://www.youtube.com/watch?v=WpzdIwYnSS0

2.Patt Vira_
p5.js Coding Tutorial | Intro to textToPoints (Kinetic Typography)
https://www.youtube.com/watch?v=eZHclqx2eJY&t=478s

3.Coding Train_Coding Challenge 178: Climate Spiral
https://www.youtube.com/watch?v=rVBTxnRyOuE

Data Resource:
1.Nasa GISS Surface Temperature Analysis (GISTEMP v4)
https://data.giss.nasa.gov/gistemp/
*/

let font;
let font2;
let font3;
let branch;
let paused = false;
let maxAge = 100;
let img;

let data;
let months;
let anomaly;
let currentRow = 0; //Year
let currentMonth = 0;

let yearSlider;
let monthSlider;

let prevAnomaly = null;

function preload() {
  font = loadFont("fonts/Casta-ThinSlanted.otf");
  font2 = loadFont("fonts/HelveticaNowDisplay-Regular.otf");
  font3 = loadFont("fonts/HelveticaNowDisplay-Bold.otf");
  data = loadTable("nasa_temperature.csv", "csv", "header");
  img = loadImage('NASA.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245);
  rectMode(CENTER);

  //get data & sliders setting
  let rows = data.getRow(0);
  let sliderX = (width - (width / 10) * 9) / 2;
  let yearSliderY = (height / 10) * 9.3-13;
  let monthSliderY = (height / 10) * 8.3+26;
  let sliderW = (width / 10) * 9;
  months = data.columns.slice(1, 13);
  years = rows.get("Year");
  let year = data.getRow(currentRow).get("Year");
  yearSlider = createSlider(0, data.getRowCount() - 1, 71, 1);
  yearSlider.position(sliderX, yearSliderY);
  yearSlider.size(sliderW);

  monthSlider = createSlider(0, months.length - 1, 4, 1);
  monthSlider.position(sliderX, monthSliderY);
  monthSlider.size(sliderW);

    //slider css
    yearSlider.addClass("mySlider");
    monthSlider.addClass("mySlider");
  
}

function draw() {
  //data value input
  currentRow = yearSlider.value();
  currentMonth = monthSlider.value();

  let rows = data.getRow(currentRow);
  let year = rows.get("Year");
  let monthName = months[currentMonth];

  let anomaly = rows.get(monthName);
  if (anomaly === "***" || anomaly === "" || anomaly == null) {
    anomaly = 0;
  } else {
    anomaly = Number(anomaly);
  }

  //draw branch
  //font of temperature
  if (prevAnomaly !== anomaly) {
    let str = anomaly + "°C";
    let fontSize = width / 4.5 + height / 16;
    let bounds = font.textBounds(str, 0, 0, fontSize);
    let x = width / 2 - bounds.w / 2+7;
    let y = height / 2.4 + bounds.h / 2;

    points = font.textToPoints(str, x, y, fontSize, {
      sampleFactor: 0.5,
      simplifyThreshold: 0,
    });

    branch = [];
    for (let i = 0; i < points.length; i++) {
      let b = new Branches(points[i].x, points[i].y, undefined, anomaly);
      push();
      fill(245, 245, 245);
      noStroke();
      rect(width / 2, height / 2.4, width, height / 2);
      pop();
      branch.push(b);
    }
    prevAnomaly = anomaly;
  }

  for (let i = branch.length - 1; i >= 0; i -= 1) {
    let b = branch[i];
    b.update();

    if (b.distFromCenter >= height / 3 || b.age > maxAge) {
      branch.splice(i, 1);
    }
    b.display();
  }

  //title & slider UI
  textAlign(CENTER, CENTER);
  noStroke();
  //Target Year & Month
  push();
  textAlign(CENTER, TOP);
  noStroke();
  fill(245);
  rect(width / 2, height / 18, width, 150);
  pop();

  push();
  textAlign(CENTER, TOP);
  textSize(width / 80 + height / 40);
  fill(24);
  text(year + ", " + monthName, width / 2, 20);
  pop();
  
  push();
  textAlign(CENTER, TOP);
  noStroke();
  textSize(10 + width / height);
  fill(24);
  textFont(font2);
  let str3 = "Global Temperature\ncompared to the baseline 1951-1980";
  text(str3, width / 2, width / 55 + height / 15, width / 3.7);

  // °FONT
  let margin = min(width, height) * 0.04;
  push();
  textAlign(LEFT, TOP);
  noStroke();
  textSize(width / 80 + height / 40);
  fill(24);
  textFont(font3);
  text("°FONT", 16, 20);
  pop();
  
  //Qrcode
  image(img, width-56-margin, 24,58,58); 
  push(); 
  textAlign(RIGHT, TOP); 
  noStroke(); 
  textSize(10 + width / height); 
  fill(24); 
  textFont(font2); 
  let str4="NASA GISS" 
  text(str4,width-margin, 80);
  
  push();
  textAlign(LEFT, TOP);
  noStroke();
  textSize(10 + width / height);
  fill(24);
  textFont(font2);
  let str2 = "An interactive font\nvisualizing the global temperature change";
  text(str2,margin+width / 8 , width / 55 + height / 15, width / 4);

  fill(190);
  textSize(14);
  textAlign(CENTER, TOP);
  text("Use the slider to select the year and month",
        width / 2, (height / 10) * 7.6);
  pop();

  //Slider text
  textSize(14);
  textAlign(CENTER, TOP);
  fill(24);
  textFont(font2);
  for (let i = 0; i < months.length; i++) {
    let x = (width*0.98 / months.length) * i + width / months.length / 2;
    let y = (height / 10) * 8.3;
    let yearY = (height / 10) * 9.3;
    text(months[i], x+width*0.01, y);
    text(
      "1880",
      width / months.length / 2 + width*0.01,
      yearY
    );
    text(
      "2025",
      (width / months.length) * 11 + width / months.length / 2 - width*0.01,
      yearY
    );
  }
  
}
