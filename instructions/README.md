To create a professional Webpack setup with separate modes and a preview server, the best practice is to use webpack-merge. This allows you to have a "Common" configuration for shared rules and separate files for "Development" and "Production."
1. Project Initialization

Create a new folder and initialize your project:

bash:
mkdir my-webpack-app && cd my-webpack-app
npm init -y

2. Install Dependencies
You will need the core Webpack packages, loaders, and the merging utility.

bash:
npm install --save-dev webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin style-loader css-loader mini-css-extract-plugin clean-webpack-plugin serve

->  webpack-dev-server: For the development live-reload.
->  serve: To act as your "live host server" for the production build.
->  mini-css-extract-plugin: To extract CSS into files (Production).

3. Folder Structure
Create the following files in your project:

my-webpack-app/
├── src/
│   ├── index.js
│   └── template.html
├── webpack.common.js
├── webpack.dev.js
├── webpack.prod.js
└── package.json

4. Configuration Files
A. webpack.common.js (Shared settings)

js:
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans the dist folder before every build
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'], 
      },
    ],
  },
};

B. webpack.dev.js (Development Mode)
This focuses on speed and a local server.

js:
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map', // Easier debugging
  devServer: {
    static: './dist',
    watchFiles: ['./src/**/*'],
    port: 3000,
    open: true, // Opens browser automatically
    hot: true,  // Hot Module Replacement
  },
});

C. webpack.prod.js (Production Mode)
This focuses on optimization and minification.

js:
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map', // Lightweight source maps for production
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'], // Extract CSS into files
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],
});

5. Configure NPM Scripts
Open your package.json and update the "scripts" section:

JSON:
"scripts": {
  "start": "webpack serve --config webpack.dev.js",
  "build": "webpack --config webpack.prod.js",
  "serve": "serve dist"
}

6. Usage Guide
1. Development Mode (Live Reload)
Run this command to start coding. It uses webpack-dev-server. Any change you save will automatically refresh the browser.

bash: npm start

2. Production Build
Run this to compile and optimize your code into the /dist folder.

bash: npm run build

3. Live Host Server (Standby)
If you want to test exactly how the site will behave on a real host (like Netlify or Vercel) without using the Dev Server's "magic," run this after building:

bash: npm run serve

Summary of Differences
Feature	    Development (npm start)	    Production (npm run build)
Speed	    Fast bundling (In-memory)	Slower (Minification/Compression)
CSS	        Injected via <style> tags	Extracted to .css files
Debugging	Full source maps	        Hidden or lightweight maps
Server	    DevServer (HMR enabled)	    Static Server (Live host simulation)