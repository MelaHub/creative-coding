const canvasSketch = require('canvas-sketch');
const math = require("canvas-sketch-util/math");
const random = require("canvas-sketch-util/random");
const Color = require("canvas-sketch-util/color");
const risoColors = require("riso-colors");

const seed = random.getRandomSeed();

const settings = {
  dimensions: [ 1000, 1000 ],
  name: seed,
  canvas: document.getElementById('skewed-canvas'),
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

const getCanvaColors = (colorNum) => {

  let colors = [];
  for (i = 0; i < colorNum; i++) {
    colors.push(random.pick(risoColors));
  }

  return colors;
}

const getRectanglesConf = (numRect, colors, width, height) => {

  let rectangles = [];

  for (let i = 0; i < numRect; i ++) {
    rectangles.push(getConf(width, height, colors));
  }

  return rectangles;
}

const drawRectangles = (context, rectangles, degrees
) =>  {
  console.log("Using seed " + seed);
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

const drawMask = (context, mask) => {

  context.save();

  context.translate(mask.x, mask.y);

  drawPolygon({context, radius: mask.radius, sides: mask.sides});
  context.restore();
}

const drawPolygon = ({context, radius = 100, sides = 3}) => {
  const slice = Math.PI * 2 / sides;

  context.beginPath();
  context.moveTo(0, -radius);
  for (let i = 1; i < sides; i++) {
    const theta = i * slice - Math.PI * 0.5;
    context.lineTo(Math.cos(theta) * radius, Math.sin(theta) * radius);
  }
  context.closePath();
}

const drawOutline = (context, mask, colors) => {
  context.save();
  context.translate(mask.x, mask.y);
  context.lineWidth = 20;
  
  drawPolygon({context, radius: mask.radius - context.lineWidth, sides: mask.sides});
  
  context.globalCompositeOperation = 'color-burn';
  
  context.strokeStyle = colors[0].hex;
  context.stroke();
  context.restore();
}

const sketch = ({ context, width, height }) => {

  const numRect = 40;
  const degrees = -30;
  const bgColor = random.pick(risoColors).hex;
  const colorNum = 2;

  const mask = {
    radius: width * 0.4,
    sides: 3,
    x: width * 0.5,
    y: height * 0.5
  };


  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    const colors = getCanvaColors(colorNum);
    drawMask(context, mask);
    context.clip();
    drawRectangles(context, getRectanglesConf(numRect, colors, width, height), degrees);
    drawOutline(context, mask, colors);
  }
};

if (settings.canvas) {
  canvasSketch(sketch, settings);
}
