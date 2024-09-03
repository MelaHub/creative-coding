const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const colormap = require('colormap');
const interpolate = require('color-interpolate');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate : true,
};

let elCanvas;
let img1, img2;

const cursor = { x: 9999, y: 9999 };
const colors = colormap({
  colormap: 'viridis',
  nshades: 20,
});

const sketch = ({width, height, canvas}) => {

  let particles = [];
  let pos = [];
  const numCircles = 30;
  const gapCircle = 8;
  const gapDot = 2;
  let dotRadius = 12;
  let cirRadius = 0;
  let ix, iy, idx, r, g, b, col1, col2, colMap, radius;
  const fitRadius = dotRadius;

  const img1Canvas = document.createElement('canvas');
  const img1Context = img1Canvas.getContext('2d');
  const img2Canvas = document.createElement('canvas');
  const img2Context = img2Canvas.getContext('2d');

  img1Canvas.width = img1.width;
  img1Canvas.height = img1.height;
  img2Canvas.width = img2.width;
  img2Canvas.height = img2.height;

  img1Context.drawImage(img1, 0, 0);
  const img1Data = img1Context.getImageData(0, 0, img1.width, img1.height).data;
  img2Context.drawImage(img2, 0, 0);
  const img2Data = img2Context.getImageData(0, 0, img2.width, img2.height).data;
  
  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown)

  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 2 * cirRadius;
    const numParticles = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
    const fitSlice = Math.PI * 2 / numParticles;

    for (let j = 0; j < numParticles; j++) {
      const theta = fitSlice * j;
      x = Math.cos(theta) * cirRadius + width / 2;
      y = Math.sin(theta) * cirRadius + height / 2;

      ix = Math.floor(x / width * img1.width);
      iy = Math.floor(y / height * img1.height);
      idx = (ix + iy * img1.width) * 4;

      r = img1Data[idx + 0];
      g = img1Data[idx + 1];
      b = img1Data[idx + 2];
      col1 = `rgb(${r}, ${g}, ${b})`;

      r = img2Data[idx + 0];
      g = img2Data[idx + 1];
      b = img2Data[idx + 2];
      col2 = `rgb(${r}, ${g}, ${b})`;

      colMap = interpolate([col1, col2]);

      radius = math.mapRange(r, 0, 255, 1, 12);

      particles.push(new Particle(x, y, colMap=colMap, radius=dotRadius));
    }
    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
  }


  return ({ context, canvas, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.sort((a, b) => a.scale - b.scale)

    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
  };
};


const loadImage = async (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = () => reject();

  });
}

const start = async () => {
  img1 = await loadImage('images/girl.jpg');
  img2 = await loadImage('images/flowers.jpg');
  canvasSketch(sketch, settings);
}

start();

class Particle {

  constructor(x, y, colMap, radius=10) {
    this.x = x;
    this.y = y;
    this.radius = radius;

    // acceleration
    this.ax = 0;
    this.ay = 0;

    // velocity
    this.vx = 0;
    this.vy = 0;

    // initial position
    this.ix = x;
    this.iy = y;

    this.minDist = random.range(100, 200);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.9, 0.95);

    this.scale = 1;
    this.colMap = colMap;
    this.color = colMap(0);
  }

  update () {
    let dx, dy, dd, distDelta;
    
    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy);
    this.scale = math.mapRange(dd, 0, 200, 1, 5);
    
    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    this.color = this.colMap(math.mapRange(dd, 0, 200, 0, 1, true));

    // push force
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);
    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
        this.ax += distDelta * dx / dd * this.pushFactor;
        this.ay += distDelta * dy / dd * this.pushFactor;
    }

    this.vx += this.ax;
    this.vy += this.ay;
    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;

  }

  draw(context) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;  
    context.beginPath();
    context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

const onMouseDown = (event) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  onMouseMove(event);

}

const onMouseMove = (event) => { 
  const x = event.offsetX / elCanvas.offsetWidth * elCanvas.width;
  const y = event.offsetY / elCanvas.offsetHeight * elCanvas.height;
  
  cursor.x = x;
  cursor.y = y;

}

onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  cursor.x = 9999;
  cursor.y = 9999;
}