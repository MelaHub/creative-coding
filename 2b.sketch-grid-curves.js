const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  id: 'curves',
};

const sketch = ({ width, height }) => {

  // grid properties
  const rows = 7;
  const cols = 20;
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

  for (let i = 0; i < numCells; i++) {
    let x = cellWidth * i % gridWidth;
    let y = cellHeight * Math.floor(i / cols);
    const n = random.noise2D(x, y, frequency = frequency, amplitude = amplitude);
    x += n;
    y += n;
    points.push(new Point({x, y}));
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, width, height);

    context.save();

    context.translate(marginX, marginY);
    context.translate(cellWidth * 0.5, cellHeight * 0.5);
    context.lineWidth = 4;
    context.strokeStyle = 'green';

    for (row = 0; row < rows; row++) {
      context.beginPath();

      for (col = 0; col < cols - 1; col++) {
        
        const curr = points[col + row * cols];
        const next = points[col + 1 + row * cols];
        const controlPoint = new Point({ 
          x: curr.x + (next.x - curr.x) / 2, 
          y: curr.y + (next.y - curr.y) / 2}); 

        if (!col) context.moveTo(curr.x, curr.y);
        else if (col == cols - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
        else context.quadraticCurveTo(curr.x, curr.y, controlPoint.x, controlPoint.y);
  
      }
      context.stroke();
    }

    context.restore();
  }
  
};

canvasSketch(sketch, settings);

class Point {

  constructor({x, y, size = 10, color = 'green'}) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  draw(context) {
    context.save();

    context.translate(this.x, this.y);
    context.fillStyle = this.color;
    
    context.beginPath();
    context.moveTo(this.x, this.y);
    context.arc(0, 0, this.size, 0, Math.PI * 2);
    context.fill();
    
    context.restore();
  }

};

