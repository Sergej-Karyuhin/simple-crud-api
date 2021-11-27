const path = require('path');

module.exports = {
  target: 'node',
  entry: {
    main: path.resolve(__dirname, './server.js'),
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
};
