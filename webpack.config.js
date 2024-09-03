const path = require('path');

module.exports = {
  entry: {
    './1.sketch-skew.js': './1.sketch-skew.js',
    './2a.sketch-interactive-curve.js': './2a.sketch-interactive-curve.js',
    './2b.sketch-grid-curves.js': './2b.sketch-grid-curves.js',
    './3a.audio.js': './3a.audio.js',
    './3b.audio.js': './3b.audio.js',
    './4a.particles.js': './4a.particles.js',
    './4b.particles-image.js': './4b.particles-image.js',
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development'
};
