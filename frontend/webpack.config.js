require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './public/index.html',
  filename: 'index.html',
})

module.exports = {
  entry: ["@babel/polyfill", "./src/index.js"],
  output: {
    path: path.join(__dirname, '/build/'),
    filename: '[name].js',
    publicPath: '/'
  },
  devtool: "source-map",
  watch: true,
  module: {
    rules: [{
      test: /\.js?$/,
      enforce: "pre",
      use: "eslint-loader",
      exclude: /node_modules/
    },
    {
      test: /\.js?$/,
      use: "babel-loader",
      exclude: /node_modules/
    },
    {
      test: /.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract(
        {
          fallback: 'style-loader',
          use: ['css-loader']
        })
    },
    {
      test: /\.(png|jpe?g|gif|ico)$/i,
      exclude: /node_modules/,
      loader: 'file-loader?name=images/[name].[ext]'
    },
    { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
    { test: /\.(ttf|eot|svg|png|jpe?g)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader" },
    
    ]},
  devServer: {
    historyApiFallback: true,
    port:3000,
  },
  resolve: {
    extensions: ['.js', '*' ],
    modules: [ path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins:[
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin('main.css',{
      allChunks: true
    }),
    new CopyWebpackPlugin([
      { from: 'public/images', to: 'images' }
    ]),
  ]
}