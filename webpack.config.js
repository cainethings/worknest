const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const packageJson = require('./package.json');

module.exports = {
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
              "@babel/preset-env", // Transpile modern JavaScript
              "@babel/preset-react" // Transpile JSX
            ],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env', // Transpile modern JavaScript
              '@babel/preset-react', // Transpile JSX
            ],
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
    // Plugin to generate HTML file and inject the bundle
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template file
    }),
    new webpack.DefinePlugin({
      __APP_VERSION__: JSON.stringify(packageJson.version),
      __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve files from 'dist' folder
    compress: true, // Enable gzip compression
    port: 3001, // Server port
    historyApiFallback: true, // Support client-side routing
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these file extensions automatically
  },
  mode: 'production', // Development mode
};
