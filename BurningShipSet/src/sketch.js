//ignore this.
//<reference path="./intellisense-config/p5.global-mode.d.ts"/>

//The coordinates to zoom in.
let coordX = 0.642889267537326942;//967270123357015
let coordY = -1.2272990293891513;


//Information about the zooming process.
let scale;
let shouldZoom = true;
const maxIterations = 2048;
const magnifyBy = 1.1;
const maxZoom = 500;

function renderBurningShip() {
  //Necessary for visualizing the zoomed section. The lower scale is the more it will appear zoomed in.
  let err = scale / pow(10, floatPrecision(coordX));
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      //ca = Re(c), cb = Im(c)
      const ca = map(x, 0, width, coordX-err, coordX+err);
      const cb = map(y, 0, height, coordY-err, coordY+err);
      
      //za = Re(z), zb = Im(z);
      let za = 0;
      let zb = 0;
      
      let count = 0;
      
      for (; count < maxIterations; ) {
        //New iterated values of za and zb
        const tempA = za * za - zb * zb + ca;
        zb = 2 * abs(za * zb) + cb;
        za = tempA;
        ++count;
        
        //If new coordinates diverge or reach a certain boundary, no more iterations will occur.
        if (za * za + zb * zb > 4)
          break;
      }

      let rgbColor = (count === maxIterations) ? [0,0,0] : HSBToRGB(((count * 2)/maxIterations) * 255, 100, 100);
      const pix = (x + y * width) * 4;
      pixels[pix] = rgbColor[0];
      pixels[pix + 1] = rgbColor[1];
      pixels[pix + 2] = rgbColor[2];
      pixels[pix + 3] = 255;
    }
  }
  
  updatePixels();
}


function setup() {
  createCanvas(600, 600);
  background(255);
  frameRate(5);
  pixelDensity(1);
  loadPixels();
  scale = pow(10, floatPrecision(coordX) + 0.5);
  //If zooming wasnt needed, then its gonna render one static image of the burning ship.
  if(!shouldZoom)
    renderBurningShip();
}

function draw() {
  if (!shouldZoom) return;
  //if scale hasn't yet reached a certain boundary, then it will continue to zoom in.
  if (floor(scale / magnifyBy) > maxZoom) {
    renderBurningShip();
    floor(scale /= magnifyBy);
  }
}

//Returns how many digits a non whole number has.
const floatPrecision = num => {
  let MAX_PRECISION = 17;
  let count = 0;
  for (; count < MAX_PRECISION && !Number.isInteger(num); ++count) {
    num *= 10;
  }
  return count;
}

//Converts Hue Saturation Brightness to Red Green Blue.
const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};
