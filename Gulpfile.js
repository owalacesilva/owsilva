'use strict';

/**
 * @see https://gist.github.com/brunoleles/ee689cac84599ab78e415748c241ccfc
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var ejs = require('gulp-ejs');
var uglify = require('gulp-uglify');
//var jshint = require('gulp-jshint');
var fancyLog = require('fancy-log');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', ['html', 'css', 'js'], function() {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  gulp.watch('src/templates/**/*.ejs', ['html']);
  gulp.watch('src/scss/**/*.scss', ['css']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/css/fonts/*.*', ['fonts']);
});

/**
 * Gulp Sass
 * =============================
 * 
 * Compile the files .sass
 */
gulp.task('css', function () {
  var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: ['node_modules/bootstrap']
  };

  var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
  };

  return gulp.src('src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Gulp Javascript
 * =============================
 * 
 * Compile the files .js
 */
gulp.task('js', function () {
  return gulp.src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js'))
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Gulp Ejs
 * =============================
 * 
 * Compile the files .ejs
 */
gulp.task('html', function () {
  return gulp.src('src/templates/**/*.ejs')
    .pipe(ejs({ msg: 'Hello Gulp!' }, {}, { ext: '.html' }).on('error', fancyLog))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/*.*')
    .pipe(gulp.dest('dist/css/fonts'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('img', function () {
  return gulp.src('src/img/*.*')
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.reload({ stream: true }));
});

/**
 * Gulp jshint
 * =============================
 * 
 * Compile the files .ejs
 */
//gulp.task('jshint', function() {
  //return gulp.src('src/js/**/*.js')
    //.pipe(jshint())
    //.pipe(jshint.reporter('jshint-stylish'));
//});

gulp.task('default', ['fonts', 'img', 'html', 'css', 'js', 'browser-sync']);