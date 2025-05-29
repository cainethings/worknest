const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');
const CompressionPlugin = require('compression-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function getFormattedTimestamp() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');

  return [
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    now.getFullYear(),
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds())
  ].join('');
}

const buildVersion = `${packageJson.version}-${getFormattedTimestamp()}`;

module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  entry: './src/index.js', // Entry point for the application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.[contenthash].js', // Output file name
    clean: true, // Clean output directory before each build
  },
  module: {
    rules: [
      // Babel loader to transpile JavaScript and JSX
      {
        test: /\.(js|jsx)$/, // Match JavaScript and JSX files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: "babel-loader", // Use Babel loader to transpile files
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage",
                  corejs: 3,
                },
              ],
              "@babel/preset-react",
            ]
          },
        },
      },
      // CSS loader for stylesheets
      {
        test: /\.css$/, // Match CSS files
        use: ['style-loader', 'css-loader'], // Inject CSS into DOM and interpret imports
      },
      // SCSS loader for Sass/SCSS stylesheets
      {
        test: /\.scss$/, // Match SCSS files
        use: ['style-loader', 'css-loader', 'sass-loader'], // Process SCSS to CSS and inject into DOM
      },
      // Image loader for importing images
      {
        test: /\.(png|jpe?g|gif|svg)$/, // Match image file formats
        type: 'asset', // Use Webpack's built-in asset modules
        generator: {
          filename: 'images/[hash][ext][query]', // Output images in 'images/' folder
        },
      },
      // Asset loader for fonts or other static files
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // Match font files
        type: 'asset/resource', // Copy these files directly to the output folder
        generator: {
          filename: 'fonts/[name][ext]', // Output fonts in 'fonts/' folder
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(buildVersion),
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin(),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from 'dist' folder
    compress: true, // Enable gzip compression
    port: 3002, // Server port
    historyApiFallback: true, // Support client-side routing
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions automatically
  },
  mode: 'production', // Development mode,
  performance: {
    hints: 'warning',
    maxAssetSize: 1012000, // 500 KiB
    maxEntrypointSize: 1012000,
  },
};
