const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('obey'),
};

let elCanvas;
let cursor;

const sketch = ({canvas, width, height}) => {

  const baseRadius = 100;
  const numCircles = 10;
  const gapCircle = 40;
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
    this.centerX = centerX;
    this.centerY = centerY;
  }

  update() { 
    this.dx = cursor.x - this.centerX;
    this.dy = cursor.y - this.centerY;
    this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    this.cursorInside = this.distance < this.radius;
  }

  draw(context) {
    context.save();
    // context.translate(this.centerX, this.centerY);

    context.strokeStyle = 'black';
    context.lineWidth = 7;

    if (this.cursorInside) {
      this.drawInsideCircle(context);
    } else {
      this.drawOutsideCircle(context);
    }

    context.restore();
  }

  drawInsideCircle(context) {
    context.beginPath();
    context.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
    context.stroke();
  }

  drawOutsideCircle(context) {
    const a = this.radius * this.radius / this.distance;
    const x = this.centerX + a * this.dx / this.distance;
    const y = this.centerY + a * this.dy / this.distance;
    const p = Math.sqrt(this.radius * this.radius - a * a);
    const x1 = x - p * this.dy / this.distance;
    const y1 = y + p * this.dx / this.distance;
    const x2 = x + p * this.dy / this.distance;
    const y2 = y - p * this.dx / this.distance;
    context.strokeStyle = 'black';
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(cursor.x, cursor.y);
    context.lineTo(x2, y2);
    context.stroke();
    context.beginPath();
    let angle1 = Math.atan2(y1 - this.centerY, x1 - this.centerX);
    let angle2 = Math.atan2(y2 - this.centerY, x2 - this.centerX);
    context.arc(this.centerX, this.centerY, this.radius, angle1, angle2);
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
