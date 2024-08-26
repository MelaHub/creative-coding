const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");

const settings = {
  dimensions: [ 1000, 1000 ]
};

const rectangleWithApi = (context, w, h, x, y) => {
  context.translate(x, y);
  context.strokeRect(w * -0.5, h * -0.5, w, h);
}

const rectanglePointToPoint = (context, w, h, x, y) => {
  context.translate(x, y);
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
  context.stroke();
}


const rectangleByCoordinates = (context, w, h, x, y) => {
  context.translate(x, y);
  context.translate(0, 0);
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
  context.stroke();
}

const skewedRectangle = (context, rx, ry, h) => {
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  
  context.moveTo(0, 0);
  context.lineTo(rx, ry);
  context.stroke();
}

const sketch = () => {

  let x, y, h, w;
  let angle, rx, ry;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    x = width * 0.5;
    y = width * 0.5;
    w = width * 0.6;
    h = height * 0.1;

    angle = 30;
    let angleRadius = math.degToRad(angle);
    rx = Math.cos(angleRadius) * w;
    ry = Math.sin(angleRadius) * w;

    console.log(rx);
    console.log(ry);
    console.log(w);

    context.save();

    context.strokeStyle = 'blue';
    skewedRectangle(context, rx, ry, h);

    context.restore();
  };
};

canvasSketch(sketch, settings);
