/*-------------------
Concat Config
-------------------*/
var config = {
  jsConcat: [
    './assets/bower_components/jquery/dist/jquery.min.js',
    './assets/js/min/**/*.js'
  ],
  cssConcat: [
    './assets/css/**/*.css',
  ]
};

/*---------------
Required Setup
---------------*/
var gulp = require('gulp'),
// Compile SCSS
sass = require('gulp-sass'),
autoprefixer = require('gulp-autoprefixer'),
// Compile JS
uglify = require('gulp-uglify'),
babel  = require('gulp-babel'),
// Add Source Maps to files
sourcemaps = require('gulp-sourcemaps'),
// Compress Images
imagemin = require('gulp-imagemin'),
// Detect changes and errors
plumber = require('gulp-plumber'),
changed = require('gulp-changed'),
notify = require("gulp-notify"),
// Rename files on compile
rename = require('gulp-rename'),
// Watches single files
watch = require('gulp-watch'),
gulpShopify = require('gulp-shopify-upload'),
// Grabs API credentials
config = require('./config.json');

/*---------------
Error notification
---------------*/
function handleErrors() {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: "Compile Error",
    message: "<%= error %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
}


/*---------------
Shopify
---------------*/
gulp.task('shopifywatch', function() {
  var options = {
    "basePath": "./Timber/"
  };

  return watch('./Timber/+(assets|layout|config|snippets|templates|locales)/**')
  .pipe(gulpShopify(config.shopify_api_key, config.shopify_api_password, config.shopify_url, null, options));
});

/*---------------
Styles
---------------*/
gulp.task('sass', function() {
  return gulp.src('./assets/scss/**/*.{sass,scss}')
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( sass({
    //includePaths: ['scss'],
    outputStyle: 'compressed',
  }).on('error', handleErrors) )
  .pipe( autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }) )
  .pipe( sourcemaps.write('maps') )
  .pipe( rename( {suffix:'.min'} ) )
  .pipe( gulp.dest('./Timber/assets') )
  .pipe( gulp.dest('./assets/css') );
});

/*---------------
Scripts
---------------*/
gulp.task('js', function() {
  return gulp.src('./assets/js/**/*.js')
  .pipe( plumber() )
  .pipe( sourcemaps.init() )
  .pipe( babel() )
  .pipe( uglify() )
  .on('error', handleErrors)
  .pipe( sourcemaps.write('maps') )
  .pipe( rename( {suffix:'.min'} ) )
  .pipe( gulp.dest('./Timber/assets') )
  .pipe( gulp.dest('./assets/js/min') );
});

/*---------------
Images
---------------*/
gulp.task('images', function() {
  return gulp.src( './assets/images/**' )
  .pipe( plumber() )
  .pipe( changed('./Timber/assets') )
  .pipe( cache( imagemin({
    progressive: true,
    interlaced: true,
    svgoPlugins: [{cleanupIDs: false}]
  }) ) )
  .on('error', handleErrors)
  .pipe( gulp.dest('./Timber/assets') )
  .pipe( gulp.dest('./assets/images') );

/*---------------
Compile Files
---------------*/
/*
gulp.task('cssConcat', function() {
  return gulp.src(config.cssConcat)
  .pipe( plumber() )
  .pipe( changed('./assets/css/**') )
  .pipe( concat('bundlecss.min.css') )
  .on('error', handleErrors)
  .pipe( gulp.dest('./Timber/assets') )
  .pipe( gulp.dest('./assets/css') );
});*/
/*
gulp.task('jsConcat', function() {
  return gulp.src(config.jsConcat)
  .pipe( plumber() )*/
  //.pipe( changed('.assets/js/**/*') )
/*  .pipe( concat('bundlejs.min.js') )
  .on('error', handleErrors)
  .pipe( gulp.dest('./Timber/assets') )
  .pipe( gulp.dest('./assets/js') );
});*/

/*---------------
Watch
---------------*/
gulp.task('watch', function() {
  gulp.watch('./assets/scss/**/*.{sass,scss}', ['sass']);
  gulp.watch('./assets/js/**/*.js', ['js']);
  gulp.watch('./assets/images/*.{jpg,jpeg,png,gif,svg}', ['images']);
  //gulp.watch(['./assets/js/**/*.js', './assets/css/**/*.css'], ['cssConcat', 'jsConcat']);
});

/*---------------
Run Gulp
---------------*/
gulp.task('default', [
  'shopifywatch',
  'watch'
]);
