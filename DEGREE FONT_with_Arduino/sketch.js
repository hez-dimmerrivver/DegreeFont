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

4.Arduino Connection(from the module of Physical Computing)
https://editor.p5js.org/RobHallArt/sketches/jWP6mg0k8

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

let data;
let months;
let anomaly;
let currentRow = 0; //Year
let currentMonth = 0;

let yearSlider;
let monthSlider;

let prevAnomaly = null;

//Arduino Glob20al Variables
let port;
let connectBtn;
let receivedMessage = { temp: 0 };
let displayTemp = 0;

// Slider Control Variables
let manualAnchor = 0;
let lastManualTime = 0;
let anchorTemp = 0;

function preload() {
  font = loadFont("fonts/Casta-ThinSlanted.otf");
  font2 = loadFont("fonts/HelveticaNowDisplay-Regular.otf");
  font3 = loadFont("fonts/HelveticaNowDisplay-Bold.otf");
  data = loadTable("nasa_temperature.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(245);
  rectMode(CENTER);

  //get data & sliders setting
  let rows = data.getRow(0);
  let sliderX = (width - (width / 10) * 9.2) / 2;
  let yearSliderY = (height / 10) * 9.3 - 13;
  let monthSliderY = (height / 10) * 8.3 + 26;
  let sliderW = (width / 10) * 9.2;
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

  //Arduino setting
  port = createSerial();

  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    port.open(usedPorts[0], 57600);
  }

  //arduino btn
  connectBtn = createButton("Connect to The Earth");
  connectBtn.position(width - 160, 26);
  connectBtn.style("background-color", "transparent");
  connectBtn.style("color", "rgb(56,55,55)");
  connectBtn.style("width", "140px");
  connectBtn.style("height", "28px");
  connectBtn.style("font-size", "12px");
  connectBtn.style("padding", "4px");
  connectBtn.style("border-radius", "20px");
  connectBtn.style("border", "1px solid rgb(0,0,0)");
  connectBtn.style("box-shadow", "none");
  connectBtn.style("outline", "none");
  connectBtn.mousePressed(connectBtnClick);
  //hover(with the help of Gemini to create hover effect)
  connectBtn.mouseOver(() => {
    connectBtn.style("background-color", "rgba(56, 55, 55, 0.1)");
  });
  connectBtn.mouseOut(() => {
    connectBtn.style("background-color", "transparent");
  });

  textAlign(CENTER, CENTER);
}

function draw() {
  //data value input
  //Arduino
  let str = port.readUntil("\n");
  if (str && isJSON(str)) {
    let data = JSON.parse(str);
    if (data.hasOwnProperty("temp")) {
      receivedMessage = data;
    }
  }

  if (!port.opened()) {
    connectBtn.html("Connect to The Earth");
  } else {
    connectBtn.html("Disconnect");
  }

  ////automatic sldier from Arduino's temperature(with the help of Gemini to create the function)
  //make the value form temperature smooth
  let sensorTemp = receivedMessage.temp;
  displayTemp = lerp(displayTemp, sensorTemp, 0.05);

  if (mouseIsPressed && mouseY > yearSlider.y - 30) {
    //manual
    manualAnchor = yearSlider.value();
    lastManualTime = millis();
    anchorTemp = displayTemp;
  } else {
    //temperature automatic control:as the temperature from the Arduino’s temperature sensor increases, the year moves forward. Besides, the year goes back when the temperature decreases significantly.
    if (millis() - lastManualTime > 1000) {
      let tempDiff = displayTemp - anchorTemp;
      let rowOffset = tempDiff * 17;
      let targetRow = manualAnchor + rowOffset;
      let currentVal = yearSlider.value();
      let smoothVal = lerp(currentVal, targetRow, 0.03);

      yearSlider.value(constrain(smoothVal, 0, data.getRowCount() - 1));
    }
  }

  currentRow = floor(yearSlider.value());
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
    let x = width / 2 - bounds.w / 2;
    let y = height / 2.36 + bounds.h / 2;

    points = font.textToPoints(str, x, y, fontSize, {
      sampleFactor: 0.5,
      simplifyThreshold: 0,
    });

    branch = [];
    for (let i = 0; i < points.length; i++) {
      let b = new Branches(points[i].x, points[i].y, undefined, anomaly);
      push();
      fill(245);
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
  // Target Year & Month
  push();
  textAlign(CENTER, TOP);
  noStroke();
  fill(245);
  rect(width / 2 - 180, height / 18, width, 120);
  pop();

  push();
  textAlign(CENTER, TOP);
  textSize(width / 80 + height / 40);
  fill(32);
  text(year + ", " + monthName, width / 2, 20);
  pop();

  push();
  textAlign(CENTER, TOP);
  noStroke();
  textSize(10 + width / height);
  fill(70);
  textFont(font2);
  let str3 = "Global Temperature\ncompared to the baseline 1951-1980.";
  text(str3, width / 2, width / 55 + height / 15, width / 3.5);

  // °FONT
  push();
  textAlign(LEFT, TOP);
  noStroke();
  textSize(width / 80 + height / 40);
  fill(32);
  textFont(font3);
  text("°FONT", 16, 20);
  pop();
  push();
  textAlign(LEFT, TOP);
  noStroke();
  textSize(10 + width / height);
  fill(70);
  textFont(font2);
  let str2 = "An interactive font\nvisualizing global temperature change";
  text(str2, width / 6 + 24, width / 55 + height / 15, width / 3);

  fill(190);
  textSize(20);
  textAlign(CENTER, TOP);
  text(
    "Use the slider to select the year and month",
    width / 2,
    (height / 10) * 7.6,
  );
  pop();

  //Slider text
  textSize(14);
  fill(36);
  textFont(font2);
  for (let i = 0; i < months.length; i++) {
    let x = (width / months.length) * i + width / months.length / 2;
    let y = (height / 10) * 8.3;
    let yearY = (height / 10) * 9.3;
    text(months[i], x, y);
    text(
      "1880",
      (width / months.length) * 0 + width / months.length / 2,
      yearY,
    );
    text(
      "2025",
      (width / months.length) * 11 + width / months.length / 2,
      yearY,
    );
  }
}

//Handle button click to toggle connection status(from the module of Physical Computing)
function connectBtnClick() {
  if (!port.opened()) {
    port.open("Arduino", 57600);
  } else {
    port.close();
  }
}
// Utility function to check if a string is valid JSON format(from the module of Physical Computing)
function isJSON(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
