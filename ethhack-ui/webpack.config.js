const path = require('path');
const webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  devtool: 'source-map',
  experiments: {
    asyncWebAssembly: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(less|css)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer")
    }
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({ 
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      "root.jQuery": "jquery",
      "window.$": "jquery",
      Buffer: ['buffer', 'Buffer'],
      process: "process/browser",
      //"i18next": "i18next",
      //"dd": "console.log",
    }),
    //new webpack.DefinePlugin({ 'log': 'console.log' })
    new webpack.DefinePlugin({ 
      'log': 'console.log' ,
      'err': 'console.error' 
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    //new HtmlWebpackPlugin({ 
    //  minify: {
    //    //removeComments: true, 
    //    //collapseWhitespace: true
    //  }, filename: 'index.html', template: 'index-tmpl.html', inject: 'body', chunks: [ 'app' ] }
    //),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    host: '0.0.0.0',
    hot: true,
  },
};
