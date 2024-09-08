const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const risoColors = require("riso-colors");

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('obey'),
};

class PointFromCenter {
  constructor(x, y, distance, distanceCoord) {
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.distanceCoord = distanceCoord;
  }
}

class Cursor {
  constructor({x, y, center}) {
    this.x = x;
    this.y = y;
    this.center = center;
    this.distance = Math.sqrt((x - center.x) * (x - center.x) + (y - center.y) * (y - center.y));
    this.distanceCoord = { x: x - center.x, y: y - center.y };
  }  

}

let elCanvas;
let cursor = new Cursor({ x: 9999, y: 9999, center: { x: 0, y: 0 } });
let points = [];

const sketch = ({canvas, width, height}) => {

  const baseRadius = 50;
  const numCircles = 10;
  const gapCircle = 30;
  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown);

  let bgColor = random.pick(risoColors).hex;
  let lineColor = random.pick(risoColors).hex;
  let evenColor = random.pick(risoColors).hex;
  let oddColor = random.pick(risoColors).hex;

  const circles = [];
  for (let i = numCircles - 1; i >= 0; i--) {
    const radius = baseRadius + i * gapCircle;
    circles.push(new Circle(radius, width/2, height/2, lineColor, i % 2 === 0 ? evenColor : oddColor));
  }
  cursor = new Cursor({ x: width/2, y: height/2, center: { x: width/2, y: height/2 } });

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    circles.forEach(circle => {
      circle.draw(context);
  })};
};

class Circle {
  constructor(radius, centerX, centerY, lineColor, fillColor) {
    this.radius = radius;
    this.center = { x: centerX, y: centerY };
    this.maxDistance = 200;
    this.lineColor = lineColor;
    this.fillColor = fillColor;
  }

  draw(context) {
    context.save();

    context.strokeStyle = this.lineColor;
    context.lineWidth = 7;
    points.forEach(point => {
      this.drawOutsideCircle(context, point);
    });
    this.isCursorInside = cursor.distance < this.radius;
    if (this.isCursorInside) {
      this.drawInsideCircle(context);
    } else {
      this.drawOutsideCircle(context, cursor);
    }

    context.restore();
  }

  drawInsideCircle(context) {
    context.beginPath();
    context.fillStyle = this.fillColor;
    context.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  }

  drawOutsideCircle(context, point) {
    const a = this.radius * this.radius / point.distance;
    const x = this.center.x + a * point.distanceCoord.x / point.distance;
    const y = this.center.y + a * point.distanceCoord.y / point.distance;
    const p = Math.sqrt(this.radius * this.radius - a * a);
    const tang1 = { x: x - p * point.distanceCoord.y / point.distance, y: y + p * point.distanceCoord.x / point.distance };
    const tang2 = { x: x + p * point.distanceCoord.y / point.distance, y: y - p * point.distanceCoord.x / point.distance };
    context.beginPath();
    context.fillStyle = this.fillColor;
    context.moveTo(tang1.x, tang1.y);

    let shapeTip = { x: point.x, y: point.y };
    if (point.distance > this.maxDistance + this.radius) {
      shapeTip = { x: this.center.x - (this.maxDistance + this.radius) * (this.center.x - point.x) / point.distance, y: this.center.y - (this.maxDistance + this.radius) * (this.center.y - point.y) / point.distance };
    }
    context.lineTo(shapeTip.x, shapeTip.y);
    context.lineTo(tang2.x, tang2.y);
    context.fill();
    context.stroke();
    context.beginPath();
    let angle1 = Math.atan2(tang1.y - this.center.y, tang1.x - this.center.x);
    let angle2 = Math.atan2(tang2.y - this.center.y, tang2.x - this.center.x);
    context.arc(this.center.x, this.center.y, this.radius, angle1, angle2);
    context.fill();
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
  
  cursor = new Cursor({ x, y, center: { x: elCanvas.width/2, y: elCanvas.height/2 } });
}

onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  points.push(new PointFromCenter(cursor.x, cursor.y, cursor.distance, cursor.distanceCoord));

}
