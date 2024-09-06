const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const colormap = require('colormap');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('moving-curves'),
};

const sketch = ({ width, height }) => {

  // grid properties
  const rows = 8;
  const cols = 72;
  const numCells = rows * cols;
  const gridWidth = width * 0.8;
  const gridHeight = height * 0.8;
  const cellWidth = gridWidth / cols;
  const cellHeight = gridHeight / rows;
  const marginX = (width - gridWidth) * 0.5;
  const marginY = (height - gridHeight) * 0.5;

  const points = [];
  let amplitude = 90;
  let frequency = 0.002;
  let n;

  let colors = colormap({
    colormap: 'summer',
    nshades: amplitude,
    format: 'hex',
    alpha: 1
  });

  for (let i = 0; i < numCells; i++) {
    let x = cellWidth * i % gridWidth;
    let y = cellHeight * Math.floor(i / cols);
    n = random.noise2D(x, y, frequency = frequency, amplitude = amplitude);
    // x += n;
    // y += n;
    let lineWidth  = math.mapRange(n, -amplitude, amplitude, 0, 5);
    let color = colors[Math.floor(math.mapRange(n, -amplitude, amplitude, 0, amplitude))];
    points.push(new Point({x, y, lineWidth: lineWidth, color: color}));
  }

  return ({ context, width, height, frame }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(marginX, marginY);
    context.translate(cellWidth * 0.5, cellHeight * 0.5);
    context.lineWidth = 4;

    points.forEach(point => {
      n = random.noise2D(point.initialX + frame * 3, point.initialY, frequency = frequency, amplitude = amplitude);
      point.x = point.initialX + n;
      point.y = point.initialY + n;
    });

    let previousControlPoint;

    for (row = 0; row < rows; row++) {
  

      for (col = 0; col < cols - 1; col++) {
        
        const curr = points[col + row * cols];
        const next = points[col + 1 + row * cols];
        const controlPoint = new Point({ 
          x: curr.x + (next.x - curr.x) * 0.8, 
          y: curr.y + (next.y - curr.y) * 5.}); 

        context.beginPath();
        context.lineWidth = curr.lineWidth;
        context.strokeStyle = curr.color

        if (!col) {
          previousControlPoint = curr;
        } 
        context.moveTo(previousControlPoint.x, previousControlPoint.y);
        context.quadraticCurveTo(curr.x, curr.y, controlPoint.x, controlPoint.y);
        
        context.stroke();

        previousControlPoint = new Point({
          x: controlPoint.x - col / cols * 250, 
          y: controlPoint.y - row / rows * 250});
  
      }
      
    }

    context.restore();
  }
  
};

canvasSketch(sketch, settings);

class Point {

  constructor({x, y, size = 10, color = 'green', lineWidth = 4}) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.lineWidth = lineWidth;
    this.initialX = x;
    this.initialY = y;
  }

};

