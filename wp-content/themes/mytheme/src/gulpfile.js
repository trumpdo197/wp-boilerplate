const gulp = require('gulp');
const del = require('del');
const gulpIf = require('gulp-if');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const favicons = require('favicons').stream;
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const postcssImport = require('postcss-import');
const postCSSMixins = require('postcss-mixins');
const postcssNested = require('postcss-nested');
const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const pxtorem = require('postcss-pxtorem');
const c = require('ansi-colors');
var argv = require('yargs').argv;
const production = !!argv.production;

const wordpressWatchPaths = [
  '../*.php',
  '../partials/**/*.php',
  '../pages/**/*.php',
];

module.exports = {
  wordpressWatchPaths,
};

// -------------------------------------
//   Config
// -------------------------------------
const webpackConfig = require('./webpack.config.js');

const config = {
  language: process.env.LANG,
  production: production,
  pxtoREM: false,
  plumber: {
    errorHandler: function (error) {
      console.log(c.red(error.message));
      this.emit('end');
    },
  },
  metadata: {
    author: 'Trung Senpai',
    year: new Date().getFullYear(),
    production: production,
  },
};

const paths = {
  dist: '../dist/', // DO NOT FUCKING EDIT THIS LINE!! It's DANGEROUS!
  css: {
    src: './css/*.css',
    dist: '../dist/css/',
    watch: './css/**/*.css',
  },
  fonts: {
    src: './fonts/**/*.{woff,woff2,eot,ttf,svg}',
    dist: '../dist/fonts/',
    watch: './fonts/**/*.{woff,woff2,eot,ttf,svg}',
  },
  favicons: {
    src: './images/favicon/*.{jpg,jpeg,png,gif}',
    dist: '../dist/images/favicons/',
  },
  images: {
    src: [
      './images/**/*.{jpg,jpeg,png,gif,tiff,svg}',
      '!./images/favicon/*',
      '!./images/svg-sprite/*',
    ],
    dist: '../dist/images/',
    watch: './images/**/*.{jpg,jpeg,png,gif,svg,tiff}',
  },
  scripts: {
    src: './scripts/index.ts',
    dist: '../dist/scripts/',
    watch: './scripts/**/*.ts',
  },
  vendors: {
    src: './vendors/**/*.*',
    dist: '../dist/vendors/',
  },
  assets: {
    dist: '../dist/',
    all: '../dist/**/*',
  },
};

// -------------------------------------
//   Startup Message
// -------------------------------------
console.log(c.bgRedBright.white(' Static Starter Build System '));
console.log('');
if (production) {
  console.log(c.green.bold.underline('🚚 Production mode'));
  console.log('');
} else {
  console.log(c.green.bold.underline('🔧 Development mode'));
  console.log('');
}

// -------------------------------------
//   Task: Server
// -------------------------------------
gulp.task('server', function (done) {
  gulp.watch(
    [paths.css.watch, './tailwind.config.js', ...wordpressWatchPaths],
    { usePolling: true },
    gulp.parallel('postcss')
  );

  gulp.watch(
    paths.scripts.watch,
    { usePolling: true },
    gulp.parallel('scripts')
  );

  gulp.watch(paths.images.watch, { usePolling: true }, gulp.parallel('images'));
  return done();
});

// -------------------------------------
//   Task: clean
// -------------------------------------
gulp.task('clean', function () {
  return del(paths.dist, {
    force: true,
  });
});

// -------------------------------------
//   Task: Favicons
// -------------------------------------
gulp.task('favicons', () => {
  return gulp
    .src(paths.favicons.src)
    .pipe(
      favicons({
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      })
    )
    .pipe(gulp.dest(paths.favicons.dist));
});

// -------------------------------------
//   Task: fonts
// -------------------------------------
gulp.task('fonts', function () {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dist));
});

// -------------------------------------
//   Task: images
// -------------------------------------
gulp.task('images', function () {
  return gulp
    .src(paths.images.src)
    .pipe(changed(paths.images.dist))
    .pipe(
      gulpIf(
        config.production,
        imagemin([
          imageminPngquant({
            speed: 4,
            quality: [0.8, 0.95],
          }),
          imageminZopfli({
            more: false,
          }),
          imageminMozjpeg({
            progressive: true,
            quality: 90,
          }),
          imagemin.svgo({
            plugins: [
              { removeViewBox: false },
              { removeUnusedNS: false },
              { removeUselessStrokeAndFill: false },
              { cleanupIDs: false },
              { removeComments: true },
              { removeEmptyAttrs: true },
              { removeEmptyText: true },
              { collapseGroups: true },
            ],
          }),
        ])
      )
    )
    .pipe(gulp.dest(paths.images.dist));
});

// -------------------------------------
//   Task: scripts
// -------------------------------------
gulp.task('scripts:webpack', function () {
  webpackConfig.mode = config.production ? 'production' : 'development';
  webpackConfig.devtool = config.production ? false : 'source-map';

  return gulp
    .src(paths.scripts.src)
    .pipe(plumber(config.plumber))
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest(paths.scripts.dist));
});

gulp.task('scripts', gulp.parallel('scripts:webpack'));

// -------------------------------------
//   Task: postcss
// -------------------------------------
const pxtoremOptions = {
  replace: true,
  propList: [
    'font',
    'font-size',
    'line-height',
    'letter-spacing',
    'margin*',
    'padding*',
    '*width',
    '*height',
  ],
  mediaQuery: true,
};
const CSSpluginsDev = [
  postcssImport,
  postCSSMixins,
  postcssNested,
  require('postcss-atroot')(),
  postcssPresetEnv({
    stage: 0,
    features: {
      'nesting-rules': true,
      'color-mod-function': true,
      'custom-media': true,
    },
  }),
  tailwindcss,
];
const CSSpluginsProd = [
  ...CSSpluginsDev,
  autoprefixer,
  cssnano({
    preset: [
      'default',
      {
        discardComments: { removeAll: true },
      },
    ],
  }),
  //pxtorem(pxtoremOptions)
];

gulp.task('postcss', function () {
  return (
    gulp
      .src(paths.css.src)
      .pipe(plumber(config.plumber))
      .pipe(gulpIf(!config.production, sourcemaps.init()))
      .pipe(gulpIf(config.production, postcss(CSSpluginsProd)))
      .pipe(gulpIf(!config.production, postcss(CSSpluginsDev)))
      // .pipe(gulpIf(!config.production, sourcemaps.write('./maps')))
      .pipe(gulpIf(config.pxtoREM, pxtorem(pxtoremOptions)))
      .pipe(gulp.dest(paths.css.dist))
  );
});

// -------------------------------------
//   Task: vendors
// -------------------------------------
gulp.task('vendors', function () {
  return gulp.src(paths.vendors.src).pipe(gulp.dest(paths.vendors.dist));
});

// -------------------------------------
//   End Message
// -------------------------------------
gulp.task('end', function (done) {
  console.log(c.bgRedBright.white(' Static Starter Build System '));
  console.log('');
  console.log(c.green.bold.underline('🚚 Production Build Finished'));
  console.log('');
  return done();
});

// -------------------------------------
//   End Message for development
// -------------------------------------
gulp.task('dev:end', function (done) {
  console.log(
    c.green.bold.underline("Let's go brothas! Waiting for file changes...")
  );
  return done();
});

// -------------------------------------
//   Task: default
// -------------------------------------
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel(
      'postcss',
      'scripts',
      'images',
      'fonts',
      'favicons',
      'vendors'
    ),
    'server',
    'dev:end'
  )
);

// -------------------------------------
//   Task: build
// -------------------------------------
gulp.task(
  'build',
  gulp.series(
    'clean',
    gulp.parallel(
      'postcss',
      'scripts',
      'images',
      'fonts',
      'favicons',
      'vendors'
    ),
    'end'
  )
);

// -------------------------------------
//   Task: build & Serve to test
// -------------------------------------
gulp.task(
  'build:serve',
  gulp.series(
    'clean',
    gulp.parallel(
      'postcss',
      'scripts',
      'images',
      'fonts',
      'favicons',
      'vendors'
    ),
    'server',
    'end'
  )
);
