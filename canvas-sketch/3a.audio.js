const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const eases = require('eases');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
  canvas: document.getElementById('moving-circle'),
};

let audio;
let audioContext, audioData, sourceNode, analyserNode;
let manager;
let minDb, maxDb;

const sketch = () => {
  const numCircles = 5;
  const numSlices = 9;
  const slice = Math.PI * 2 / numSlices;
  const baseRadius = 200;

  const bins = [];
  let bin;
  for (let i = 0; i < numCircles * numSlices; i++) {
    bin = random.rangeFloor(4, 64); 
    if (random.value() > 0.5) bin = 0; 
    bins.push(bin);
  }

  const lineWidths = [];
  for (let i = 0; i < numCircles; i++) {
    const t = i / (numCircles - 1);
    lineWidths.push(eases.quadIn(t) * 200 + 20);
  }

  return ({ context, width, height }) => {
    context.fillStyle = '#EEEAE0';
    context.fillRect(0, 0, width, height);

    if (!audioContext) return;

    analyserNode.getFloatFrequencyData(audioData);

    context.save();
    context.translate(width * 0.5, height * 0.5);
      
    let cRadius = baseRadius;

    for (let i = 0; i < numCircles; i++) {  
      context.save();
      
      for (let j = 0; j < numSlices; j++) {
        context.rotate(slice);

        const bin = bins[i * numSlices + j];
        if (!bin) continue;
        const mapped = math.mapRange(audioData[bin], minDb, maxDb, 0, 1, true);
        
        const lineWidth = lineWidths[i] * mapped;
        if (lineWidth < 0) continue;
        context.lineWidth = lineWidth;
        

        context.beginPath();
        context.arc(0, 0, cRadius + context.lineWidth * 0.5, 0, slice);
        context.stroke();
      }

      cRadius += context.lineWidth;
      context.restore();
      
    }
    context.restore();
    
  };
};

const addListeners = () => {
  window.addEventListener('mouseup', () => {
    if (!audioContext) createAudio();
    if (audio.paused) {
      audio.play();
      manager.play();
    } else {
      audio.pause();
      manager.pause();
    }
    minDb = analyserNode.minDecibels;
    maxDb = analyserNode.maxDecibels;
  });
}

const createAudio = () => {
  audio = document.createElement('audio');
  audio.src = 'https://archive.org/download/Louis_Armstrong_Tape_6_Variation_1928-1929/Louis_Armstrong_Tape_6_Variation_1928-1929_Side_A.wav';
  audio.crossOrigin = "anonymous";

  audioContext = new AudioContext();
  sourceNode = audioContext.createMediaElementSource(audio);
  sourceNode.connect(audioContext.destination);

  analyserNode = audioContext.createAnalyser();
  analyserNode.fftSize = 512;
  analyserNode.smoothingTimeConstant = 0.9;
  sourceNode.connect(analyserNode);

  audioData = new Float32Array(analyserNode.frequencyBinCount);
}

const getAverage = (data) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i];
  }
  return sum / data.length;
}

const start = async () => {
  addListeners();

  manager = await canvasSketch(sketch, settings);
  manager.pause();
}

start();