const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path');

const aliases = {
  src: 'source',
  dist: 'dist',
  suffix: 'bundle',
  vendor: 'vendor',
};
const basePath = __dirname;
const paths = {
  source: path.resolve(basePath),
  dist: path.resolve(basePath, aliases.dist),
};

module.exports = {
  entry: {
    panel: `${paths.source}/src/app/panel.js`,
  },
  output: {
    filename: `[name].${aliases.suffix}.js`,
    chunkFilename: `${aliases.vendor}.${aliases.suffix}.js`,
    path: paths.dist,
    publicPath: `/${aliases.dist}/`,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/**/*.{html,js}', to: './', transformPath: (targetPath, absolutePath) => {
            return targetPath.replace('src' + path.sep, '')
          }
        },
        { from: './assets/', to: './assets' },
        { from: './src/manifest.json', to: './' }
      ]
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ]
  }
};
