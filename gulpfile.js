var path = require('path');
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// set variable via $ gulp --type production
var environment = process.env.NODE_ENV || 'development';
var isProduction = environment === 'production';
var webpackConfig = require('./webpack.config.js').getConfig(environment);

var port = $.util.env.port || 1337;
var app = 'src/';
var dist = 'dist/';

// https://github.com/ai/autoprefixer
var autoprefixerBrowsers = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 6',
  'opera >= 23',
  'ios >= 6',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('js-libs', function() {
  return gulp.src(app + 'scripts/libs/*.js')
    .pipe(gulp.dest(dist + 'js/libs/'));
});

gulp.task('scripts', function() {
  return gulp.src(webpackConfig.entry)
    .pipe($.webpack(webpackConfig))
    .pipe(isProduction ? $.uglify() : $.util.noop())
    .pipe(gulp.dest(dist + 'js/'))
    .pipe(isProduction?$.util.noop():$.size({ title : 'js' }))
    .pipe(isProduction?$.util.noop():$.connect.reload());
});

// copy html from app to dist
gulp.task('html', function() {
  return gulp.src(app + 'index.html')
    .pipe(gulp.dest(dist))
    .pipe(isProduction?$.util.noop():$.size({ title : 'html' }))
    .pipe(isProduction?$.util.noop():$.connect.reload());
});

gulp.task('css',function() {
  return gulp.src(app + 'stylus/*.css')
    .pipe(gulp.dest(dist + 'css/'))
    .pipe(isProduction?$.util.noop():$.size({ title: 'css'}))
    .pipe(isProduction?$.util.noop():$.connect.reload());
});

gulp.task('styles',function(cb) {

  // convert stylus to css
  return gulp.src(app + 'stylus/main.styl')
    .pipe($.stylus({
      // only compress if we are in production
      compress: isProduction,
      // include 'normal' css into main.css
      'include css' : true
    }))
    .pipe($.autoprefixer({browsers: autoprefixerBrowsers}))
    .pipe(gulp.dest(dist + 'css/'))
    .pipe(isProduction?$.util.noop():$.size({ title : 'css' }))
    .pipe(isProduction?$.util.noop():$.connect.reload());

});

// add livereload on the given port
gulp.task('serve', function() {
  $.connect.server({
    root: dist,
    port: port,
    livereload: {
      port: 35729
    }
  });
});

// copy images
gulp.task('images', function(cb) {
  return gulp.src(app + 'images/**/*.{png,jpg,jpeg,gif}')
    .pipe($.size({ title : 'images' }))
    .pipe(gulp.dest(dist + 'images/'));
});

// watch styl, html and js file changes
gulp.task('watch', function() {
  gulp.watch(app + 'stylus/*.styl', ['styles']);
  gulp.watch(app + 'stylus/*.css', ['css']);
  gulp.watch(app + 'index.html', ['html']);
  gulp.watch(app + 'scripts/**/*.js', ['scripts']);
  gulp.watch(app + 'scripts/**/*.jsx', ['scripts']);
});

// remove bundels
gulp.task('clean', function(cb) {
  del([dist], cb);
});


// by default build project and then watch files in order to trigger livereload
var tasks = ['images', 'html','scripts','js-libs', 'styles', 'css', 'serve', 'watch'];

if (environment == "production") {
  tasks = ['images', 'html','scripts','js-libs', 'styles', 'css'];
}

gulp.task('default', tasks);

// waits until clean is finished then builds the project
gulp.task('build', ['clean'], function(){
  gulp.start(['images', 'html','scripts','styles']);
});
