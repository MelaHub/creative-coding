const path = require('path');

module.exports = {
  entry: './1.sketch-skew.js',
  output: {
    filename: 'skew.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
};

module.exports = {
    entry: './2a.sketch-interactive-curve.js',
    output: {
      filename: 'interactive-curve.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
  };
  
module.exports = {
    entry: './2b.sketch-grid-curves.js',
    output: {
        filename: 'curves.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
};

