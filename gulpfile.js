// Load all the required plugins.
var gulp   = require('gulp'),
  notify = require('gulp-notify'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  rename = require('gulp-rename');

var scripts = [
  'src/_Module.js',
  'src/Config.js',
  'src/Eventer.js',
  'src/Route.js',
  'src/Router.js',
  'src/Utility.js'
];

gulp.task('scripts', function() {
  return gulp.src(scripts)
    .pipe(concat('pjax-router.js'))
    .pipe(gulp.dest('.'))
    .pipe(rename('pjax-router.min.js'))
    .pipe(uglify({mangle: true}))
    .pipe(gulp.dest('.'))
    .pipe(notify({ message: 'Javascript files compiled.' }));
});

// When running gulp without any tasks, it'll watch the scripts, styles, and do artisan publishing.etc.
gulp.task('default' , function() {
  gulp.run('scripts');

  // Watch the JS directory.
  gulp.watch('src/**' , function() {
    gulp.run('scripts');
  });
});


