const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 1080, 1080 ],
  canvas: document.getElementById('obey'),
};

let elCanvas;
const cursor = { x: 0, y: 0 };

const sketch = ({canvas}) => {

  const baseRadius = 100;
  elCanvas = canvas;
  canvas.addEventListener('mousedown', onMouseDown)

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

  console.log(cursor);
}

onMouseUp = () => {
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);

  cursor.x = 0;
  cursor.y = 0;
}
