const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ]
};

const sketch = () => {

  const baseRadius = 100;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    drawCircle(context, baseRadius, width, height);
  };
};

const drawCircle = (context, baseRadius, width, height) => {
  context.save();

  context.translate(width * 0.5, height * 0.5);

  context.strokeStyle = 'black';
  context.lineWidth = 5;

  context.beginPath();
  context.arc(0, 0, baseRadius, 0, Math.PI * 2);
  context.stroke();

  context.restore();
}

canvasSketch(sketch, settings);
