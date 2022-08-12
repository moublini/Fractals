//ignore this.
//<reference path="./intellisense-config/p5.global-mode.d.ts"/>

const maxIterations = 256;

function renderBurningShipJuliaSet(ca, cb, scale) {
  //scale needs to be true if the convertion from pixel to coordinates is necessary
  //ca = Re(c), cb = Im(c);
  if (scale) {
    ca = map(ca, 0, width, -2, 2); 
    cb = map(cb, 0, height, -2, 2);
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // a = Re(z), b = Im(z)
      let a = map(x, 0, width, -2, 2);
      let b = map(y, 0, height, -2, 2);
      let count = 0;
      
      for (; count < maxIterations;) {
        //New values of a and b after an iteration.
        const tempA = (a * a - b * b) + ca;
        b = abs(2 * a * b) + cb;
        a = tempA;

        ++count;

        if (a * a + b * b > 4)
          break;
      }


      const hue = (count/maxIterations) * 360;
      //Color array with RGB (Red Green Blue) Values
      rgbColor = (hue === 360) ? [0, 0, 0] : HSBToRGB(hue, 100, 100);
      
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
  frameRate(24);
  pixelDensity(1);
  loadPixels();
}

function draw() {
  renderBurningShipJuliaSet(mouseX, mouseY, true);
}

//Converts Hue Saturation Brightness to Red Green Blue.
const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};
