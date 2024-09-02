const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const eases = require('eases');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate : true,
};

let elCanvas;

const cursor = { x: 9999, y: 9999 };

const sketch = ({width, height, canvas}) => {

  let particles = [];
  let pos = [];
  const numCircles = 15;
  const gapCircle = 8;
  const gapDot = 4;
  let dotRadius = 12;
  let cirRadius = 0;
  const fitRadius = dotRadius;

  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown)

  for (let i = 0; i < numCircles; i++) {
    const circumference = Math.PI * 2 * cirRadius;
    const numParticles = i ? Math.floor(circumference / (fitRadius * 2 + gapDot)) : 1;
    const fitSlice = Math.PI * 2 / numParticles;
    let radius = dotRadius;
    for (let j = 0; j < numParticles; j++) {
      const theta = fitSlice * j;
      x = Math.cos(theta) * cirRadius + width / 2;
      y = Math.sin(theta) * cirRadius + height / 2;
      particles.push(new Particle(x, y, radius=dotRadius));
    }
    cirRadius += fitRadius * 2 + gapCircle;
    dotRadius = (1 - eases.quadOut(i / numCircles)) * fitRadius;
  }


  return ({ context, canvas, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    particles.forEach(particle => {
      particle.update();
      particle.draw(context);
    });
  };
};

canvasSketch(sketch, settings);

class Particle {

  constructor(x, y, radius=10) {
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
  }

  update () {
    let dx, dy, dd, distDelta;

    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

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
    context.fillStyle = 'white';  
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
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


  console.log(cursor);
}

onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  cursor.x = 9999;
  cursor.y = 9999;
}