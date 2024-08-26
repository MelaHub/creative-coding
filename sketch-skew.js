const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");

const settings = {
  dimensions: [ 1000, 1000 ]
};

const getCoordinates = (width, height) => {
  const x = random.range(0, width);
  const y = random.range(0, height);
  const w = random.range(200, 600);
  const h = random.range(40, 200);
  return [x, y, w, h];
}

const getCoordinatesByAngle = (w, h, degrees) => {
  let radiant = math.degToRad(degrees);
  let rx = Math.cos(radiant) * w;
  let ry = Math.sin(radiant) * w;
  return [rx, ry];
}

const rectangleWithApi = (context, w, h) => {
  context.strokeRect(w * -0.5, h * -0.5, w, h);
}

const rectanglePointToPoint = (context, w, h) => {
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
}

const rectangleByCoordinates = (context, w, h) => {
  context.beginPath();
  context.moveTo(w * -0.5, h * -0.5);
  context.lineTo(w * 0.5, h * -0.5);
  context.lineTo(w * 0.5, h * 0.5);
  context.lineTo(w * -0.5, h * 0.5);
  context.closePath();
}

const skewedRectangle = (context, w=600, h=200, degrees=-45) => {
  const [rx, ry] = getCoordinatesByAngle(w, h, degrees);
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

}

const sketch = () => {

  let x, y, w, h;

  const numRect = 20;
  const degrees = -30;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    for (let i = 0; i < 20; i ++) {
      [x, y, w, h] = getCoordinates(width, height);
    
      context.save();

      context.translate(x, y);
      context.strokeStyle = 'blue';

      skewedRectangle(context, w, h, degrees);

      context.stroke();
      context.restore();
    }
  };
};

canvasSketch(sketch, settings);
