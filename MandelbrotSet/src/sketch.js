//ignore this thing
//<reference path="./intellisense-config/p5.global-mode.d.ts"/>


let iterations = 2048;
//coordinates to zoom in. a = Re(c), b = Im(c).
let coordA = 0.27995005336846623;
let coordB = 0.01006000261013678;

let scale;
//extremely important to define how much is it possible to zoom.
let err;

const magnifyBy = 1.5;
//as scale tends towards 0, a huge pixel mess is created. This avoids it.
const maxZoom = 1000;

function renderMandelbrotSet() {
  err = scale / zoomPrecision;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      //a and b coordinates of every pixel scaled
      let a = map(x, 0, width, coordA - err, coordA + err);
      let b = map(y, 0, height, coordB - err, coordB + err);
      
      const da = a;
      const db = b;
  
      let count = 0;
      for (; count < iterations; count++) {
        //new values of z
        const tempA = (a * a - b * b) + da;
        b = (2 * a * b) + db;
        a = tempA;
        
        //If the chosen values of a diverge or reach a certain boundary, then the iteration process will come to an halt.
        if (a + b > 2) break;
      }
      //The more iterations a pixel needed to reach the boundary, the more its color is white.
      let bright = sqrt(count/iterations) * 255;
      //if you want to use HSB to color different regions then make bright an array with 3 elements.
      //bright = HSBToRGB(sqrt(bright) * 360, 100, 100);

      //except when it didn't escape, in this case we will color that pixel black.
      if (count === iterations)
        bright = 0;

      //This assigns a certain grayscale value for the specific pixel matching the a and b coordinates.
      const pix = (x + y * width) * 4;
  
      pixels[pix] = bright;
      pixels[pix + 1] = bright;
      pixels[pix + 2] = bright;
      pixels[pix + 3] = 255;
    }
  }
  //Last we will display every pixel on the screen.
  updatePixels();
}

function setup() {
  //creates the canvas where the image will display. Size is defined by pixels.
  createCanvas(600, 600);
  //This avoids the image to behave very weirdly.
  pixelDensity(1);
  frameRate(2);
  loadPixels();


  //we will start the zooming process from a specific point, if we want to start a bit deeper then we will divide maxZoom by some value.
  zoomPrecision = pow(10, floatPrecision(coordA));
  scale = zoomPrecision / 1000;
}

function draw() {
  if (floor(scale / magnifyBy) > maxZoom) {
    renderMandelbrotSet();
    floor(scale /= magnifyBy);
  } else {
    //In case its not possible to zoom in anymore, we print new values for a and b so in the next time this script will run, its possible to zoom in a different location.
    console.log(
      map(mouseX, 0, width, coordA - err, coordA + err), 
      map(mouseY, 0, height, coordB - err, coordB + err)
    );
  }
}

//Tells how many digits a non whole number passed as parameter has.
const floatPrecision = num => {
  const MAX_PRECISION = 17;
  let count = 0;
  while (count <= MAX_PRECISION && !Number.isInteger(num)) {
    num *= 10;
    ++count;
  }
  return count;
}

//Comverts Hue Saturation Brightness colro to a Red Green Blue one.
const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};

