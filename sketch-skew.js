const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [ 1000, 1000 ]
};

const getCoordinates = (width, height) => {
  const x = width * 0.5;
  const y = width * 0.5;
  const w = width * 0.6;
  const h = height * 0.1;
  return [x, y, w, h];
}

const rectangleWithApi = (context, width, height) => {
  const [x, y, w, h] = getCoordinates(width, height);
  context.translate(x, y);
  context.strokeRect(w * -0.5, h * -0.5, w, h);
}

const rectanglePointToPoint = (context, width, height) => {
  const [x, y, w, h] = getCoordinates(width, height);
  context.translate(x, y);
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
  context.stroke();
}

const rectangleByCoordinates = (context, width, height) => {
  const [x, y, w, h] = getCoordinates(width, height);
  context.translate(x, y);
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
  context.stroke();
}

const skewedRectangle = (context, angle, w, h) => {
  let angleRadius = math.degToRad(angle);
  let rx = Math.cos(angleRadius) * w;
  let ry = Math.sin(angleRadius) * w;

  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  
  context.lineTo(rx, ry);
  context.stroke();
}

const sketch = () => {

  let angle;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    angle = 30;
    context.save();

    context.strokeStyle = 'blue';
    rectangleByCoordinates(context, width, height);

    context.restore();
  };
};

canvasSketch(sketch, settings);
