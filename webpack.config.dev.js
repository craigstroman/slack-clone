const path = require('path');
const webpack = require('webpack');

module.exports = env => {
  const nodeEnv = process.env.NODE_ENV;
  const filePath = path.join(__dirname, './public/js/')
  const fileName = 'bundle.js';

  const PATHS = {
      src: path.join(__dirname, './client'),
      dist: path.join(__dirname, './public')
  }

  return {
    entry: {
       app: path.join(__dirname, 'client/App.jsx')
    },

    output: {
      path: filePath,
      filename: fileName,
    },

    resolve: {
      extensions: [
        '.js','.jsx'
      ]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-class-properties', { "loose": true }],
                ['@babel/plugin-proposal-decorators', { "legacy": true }],
                ['@babel/plugin-transform-async-to-generator'],
                ['@babel/plugin-transform-runtime']
              ]
            },
          }
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'eslint-loader',
            options: './client/.eslintrc.js'
          }
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader' // creates style nodes from JS strings
            },
            {
              loader: 'css-loader' // translates CSS into CommonJS
            },
            {
              loader: 'sass-loader' // compiles Sass to CSS
            },
            {
              loader: 'sass-resources-loader',
              options: {
                resources: require(path.join(process.cwd(), 'client/shared/scss/utils.js'))
              }
            }
          ]
        },
        {
             test: /\.(svg|woff|woff2|ttf|eot|otf)([\?]?.*)$/,
             loader: 'file-loader?name=node_modules/@fortawesome/fontawesome-free/webfonts[name].[ext]',
        }
      ]
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        NODE_ENV: nodeEnv,
      })
    ]
  }
};
