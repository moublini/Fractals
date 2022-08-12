//ignore this.
//<reference path="../intellisense-config/p5.global-mode.d.ts"/>

let iters = 250;

function renderJuliaSet(iterations, ca, cb, mapAB) {
  //mapAB is for the convertion from pixels to mapped coordinates.
  if (mapAB) {
    ca = map(ca, 0, width, -1.6, 1.6);
    cb = map(cb, 0, width, -1.6, 1.6);
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      //Mapped values. a = Re(z), b = Im(z)
      let a = map(x, 0, width, -1.6, 1.6);
      let b = map(y, 0, height, -1.6, 1.6);
      let count = 0;
      for ( ; count < iterations; ) {
        //New values of Re(z) and Im(z) after an iteration.
        const tempA = (a * a - b * b) + ca;
        b = (2 * a * b) + cb;
        a = tempA;
        ++count;

        //If the new iterated values reach a certain boundary or diverge, the iteration process comes to an halt.
        if (a + b > 2)
          break;
      }
      
      const hue = sqrt(count/iterations) * 360;
      const colorLoop = 2;
      const rgbValues = (hue===360) ? [0,0,0] : HSBToRGB(hue * colorLoop, 100, 100);
      const pix = (x + y * width) * 4;
      pixels[pix] = rgbValues[0];
      pixels[pix + 1] = rgbValues[1];
      pixels[pix + 2] = rgbValues[2];
      pixels[pix + 3] = 255;
    }
  }
  updatePixels()
}

function setup() {
  createCanvas(600, 600);
  pixelDensity(1);
  loadPixels()
  frameRate(10);
}

function draw() {
  renderJuliaSet(iters, mouseX, mouseY, true);  
}


// Converts Hue Saturation Brightness to Red Green Blue
const HSBToRGB = (h, s, b) => {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
  return [255 * f(5), 255 * f(3), 255 * f(1)];
};
