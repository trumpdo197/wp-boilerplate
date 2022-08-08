/**
 * Necessary imports
 */
const path = require('path');
const { readdirSync } = require('fs');

/**
 * Define variables and functions
 */

const SCRIPTS_PATH = path.join(__dirname, 'scripts');
const PAGE_SCRIPTS_PATH = path.join(SCRIPTS_PATH, 'pages');

const getScriptsFiles = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => !dirent.isDirectory() && dirent.name.match(/\.ts/g))
    .map((dirent) => dirent.name);

const scripts = getScriptsFiles(PAGE_SCRIPTS_PATH);
const scriptNamesWithoutExtension = scripts.map((filename) =>
  filename.substring(0, filename.length - 3)
);

const scriptEntries = {};
scriptNamesWithoutExtension.forEach((scriptName) => {
  scriptEntries[scriptName] = path.resolve(
    __dirname,
    PAGE_SCRIPTS_PATH,
    scriptName + '.ts'
  );
});

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    main: path.resolve(SCRIPTS_PATH, 'index.ts'),
    ...scriptEntries,
  },
  output: {
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js', '.json'],
  },
};
