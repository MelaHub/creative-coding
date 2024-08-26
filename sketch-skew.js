const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const settings = {
  dimensions: [ 1000, 1000 ]
};

const getConf = (width, height, rectColors) => {
  const x = random.range(0, width);
  const y = random.range(0, height);
  const w = random.range(600, width);
  const h = random.range(40, 200);

  const fill = random.pick(rectColors).hex;
  const stroke = random.pick(rectColors).hex;

  const blend = (random.value() > 0.5) ? 'overlay' : 'source-over';
  return {x, y, w, h, fill, stroke, blend};
}

const getCoordinatesByAngle = (w, degrees) => {
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
  const [rx, ry] = getCoordinatesByAngle(w, degrees);
  context.translate(rx * -0.5, (ry + h) * -0.5);
  context.beginPath();
  context.moveTo(0, 0);
  
  context.lineTo(rx, ry);
  context.lineTo(rx, ry + h);
  context.lineTo(0, h);
  context.closePath();

}

const sketch = ({ context, width, height }) => {

  const numRect = 40;
  const degrees = -30;
  const bgColor = random.pick(risoColors).hex;
  const rectColorNum = 2;

  let rectangles = [];

  let rectColors = [];
  for (i = 0; i < rectColorNum; i++) {
    rectColors.push(random.pick(risoColors));
  }

  for (let i = 0; i < numRect; i ++) {
    rectangles.push(getConf(width, height, rectColors));
  }

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    rectangles.forEach(rect => {
      const {x, y, w, h, fill, stroke, blend} = rect;
      context.save();

      context.translate(x, y);
      context.strokeStyle = stroke;
      context.fillStyle = fill;
      context.lineWidth = 10;

      context.globalCompositeOperation = blend;

      skewedRectangle(context, w, h, degrees);

      let shadowColor = Color.offsetHSL(fill, 0, 0, -20);
      shadowColor.rgba[3] = 0.5;

      context.shadowColor = Color.style(shadowColor.rgba);
      context.shadowOffsetX = -10;
      context.shadowOffsetY = 20;

      context.fill();

      context.shadowColor = null;
      context.stroke();

      context.globalCompositeOperation = 'source-over';
      context.lineWidth = 2;
      context.strokeStyle = 'black';
      context.stroke();

      context.restore();
    }
    );
  }
};

canvasSketch(sketch, settings);
