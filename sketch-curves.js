const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

let elCanvas;

let points;

const sketch = ({canvas}) => {

  canvas.addEventListener('mousedown', onMouseDown);
  elCanvas = canvas;
  points = [
    new Point({ x: 200, y: 540 }),
    new Point({ x: 400, y: 700 }),
    new Point({ x: 880, y: 540 }),
    new Point({ x: 600, y: 700 }),
    new Point({ x: 640, y: 900 }),
  ];

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.strokeStyle = '#999';
    context.beginPath();

    context.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();

    context.beginPath();

    let currControlPoint;

    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      currControlPoint = new Point({ 
        x: curr.x + (next.x - curr.x) / 2, 
        y: curr.y + (next.y - curr.y) / 2, 
        control: true,
        size: 5,
        controlColor: 'blue'}); 
      
      if (i == 0) context.moveTo(curr.x, curr.y);
      else if (i == points.length - 2) context.quadraticCurveTo(curr.x, curr.y, next.x, next.y);
      else context.quadraticCurveTo(curr.x, curr.y, currControlPoint.x, currControlPoint.y);
    }
   
    context.lineWidth = 4;
    context.strokeStyle = 'blue';
    context.stroke();

    points.forEach(point => point.draw(context));

  };
};

canvasSketch(sketch, settings);

class Point {

  constructor({x, y, control = false, size = 10, controlColor = 'red', anchorColor = 'black'}) {
    this.x = x;
    this.y = y;
    this.control = control;
    this.size = size;
    this.controlColor = controlColor;
    this.anchorColor = anchorColor;
  }

  draw(context) {
    context.save();

    context.translate(this.x, this.y);
    context.fillStyle = this.control ? this.controlColor : this.anchorColor;

    context.beginPath();
    context.moveTo(this.x, this.y);
    context.arc(0, 0, this.size, 0, Math.PI * 2);
    context.fill();
    
    context.restore();
  }

  hitTest(x, y) {
    return Math.hypot(this.x - x, this.y - y) < this.size;
  }
};

const onMouseDown = (event) => {
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  
  const x = event.offsetX / elCanvas.offsetWidth * elCanvas.width;
  const y = event.offsetY / elCanvas.offsetHeight * elCanvas.height;
  
  let hit = false;
  points.forEach(point => {
    point.isDragging = point.hitTest(x, y);
    if (!hit && point.isDragging) hit = true;
  });

  if (!hit) {
    points.push(new Point({ x, y }));
  }
}

const onMouseMove = (event) => {
  const x = event.offsetX / elCanvas.offsetWidth * elCanvas.width;
  const y = event.offsetY / elCanvas.offsetHeight * elCanvas.height;
  
  points.forEach(point => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
}

const onMouseUp = () => {    
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
}