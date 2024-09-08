const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('obey'),
};

let elCanvas;
let cursor = { x: 9999, y: 9999 };

const sketch = ({canvas, width, height}) => {

  const baseRadius = 50;
  const numCircles = 10;
  const gapCircle = 30;
  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  const circles = [];
  for (let i = 0; i < numCircles; i++) {
    const radius = baseRadius + i * gapCircle;
    circles.push(new Circle(radius, width/2, height/2));
  }
  cursor = { x: width/2, y: height/2 };

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    circles.forEach(circle => {
      circle.update();
      circle.draw(context);
  })};
};

class Circle {
  constructor(radius, centerX, centerY) {
    this.radius = radius;
    this.center = { x: centerX, y: centerY };
    this.point = { x: cursor.x, y: cursor.y };
    this.maxDistance = 200;
  }

  update() { 
    this.distanceCoord = { x: cursor.x - this.center.x, y: cursor.y - this.center.y };
    this.distance = Math.sqrt(this.distanceCoord.x * this.distanceCoord.x + this.distanceCoord.y * this.distanceCoord.y);
    this.isCursorInside = this.distance < this.radius;
    if (this.distance > this.maxDistance + this.radius) {
      this.point = { x: this.center.x - (this.maxDistance + this.radius) * (this.center.x - cursor.x) / this.distance, y: this.center.y - (this.maxDistance + this.radius) * (this.center.y - cursor.y) / this.distance };
    } else {
      this.point = { x: cursor.x, y: cursor.y };
    }
  }

  draw(context) {
    context.save();

    context.strokeStyle = 'black';
    context.lineWidth = 7;

    if (this.isCursorInside) {
      this.drawInsideCircle(context);
    } else {
      this.drawOutsideCircle(context);
    }

    context.restore();
  }

  drawInsideCircle(context) {
    context.beginPath();
    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    context.stroke();
  }

  drawOutsideCircle(context) {
    const a = this.radius * this.radius / this.distance;
    const x = this.center.x + a * this.distanceCoord.x / this.distance;
    const y = this.center.y + a * this.distanceCoord.y / this.distance;
    const p = Math.sqrt(this.radius * this.radius - a * a);
    const tang1 = { x: x - p * this.distanceCoord.y / this.distance, y: y + p * this.distanceCoord.x / this.distance };
    const tang2 = { x: x + p * this.distanceCoord.y / this.distance, y: y - p * this.distanceCoord.x / this.distance };
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(tang1.x, tang1.y);
    context.lineTo(this.point.x, this.point.y);
    context.lineTo(tang2.x, tang2.y);
    context.stroke();
    context.beginPath();
    let angle1 = Math.atan2(tang1.y - this.center.y, tang1.x - this.center.x);
    let angle2 = Math.atan2(tang2.y - this.center.y, tang2.x - this.center.x);
    context.arc(this.center.x, this.center.y, this.radius, angle1, angle2);
    context.stroke();
  }
}

canvasSketch(sketch, settings);


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

  cursor.x = elCanvas.width/2;
  cursor.y = elCanvas.height/2;
}
