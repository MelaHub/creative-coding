const path = require('path');

module.exports = {
  entry: {
    './1.sketch-skew.js': './canvas-sketch/1.sketch-skew.js',
    './2a.sketch-interactive-curve.js': './canvas-sketch/2a.sketch-interactive-curve.js',
    './2b.sketch-grid-curves.js': './canvas-sketch/2b.sketch-grid-curves.js',
    './3a.audio.js': './canvas-sketch/3a.audio.js',
    './3b.audio.js': './canvas-sketch/3b.audio.js',
    './4a.particles.js': './canvas-sketch/4a.particles.js',
    './4b.particles-image.js': './canvas-sketch/4b.particles-image.js',
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'public/creative-coding/assets/scripts')
  },
  mode: 'development'
};
