const path = require('path');

module.exports = {
  entry: './sketch-skew.js',
  output: {
    filename: 'sketch-skew.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'production'
};

module.exports = {
    entry: './sketch-curves.js',
    output: {
      filename: 'sketch-curves.js',
      path: path.resolve(__dirname, 'dist')
    },
    mode: 'production'
  };
  
