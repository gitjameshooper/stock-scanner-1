var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    browserify = require('browserify'),
    runSequence = require('run-sequence'),
    rename = require('gulp-rename'),
    bundle = require('gulp-bundle-assets'),
    del = require('del'),
    less = require('gulp-less'),
    path = require('path'),
    browserSync = require('browser-sync').create();
 
// Delete Build folder
gulp.task('clean', function() {
  return del(['app']);
});


// Uses bundle.config.js to find npm js files and bundles/uglifys them
gulp.task('bundleScripts', function() {
  return gulp.src('src/bundle.config.js')
    .pipe(bundle())
    .pipe(rename('global.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream({match: '**/**/*.js'}));
});
// copy all other files needed to app
gulp.task('copy',  function () {
        return gulp.src(['src/**/*', '!src/**/*.js', '!src/less{,/**}', 'node_modules/font-awesome/fonts{,/**}'])
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
    });


gulp.task('less', function () {
  return gulp.src('src/less/global.less')
    .pipe(less({
      paths: [ './node_modules/bootstrap-less', './node_modules/font-awesome/less', path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(rename('global.css'))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

//  Start Webserver 
gulp.task('browser-sync', function() {
    browserSync.init({
        reloadDebounce: 5000,
        server: "./app",
        port: 2000,
        tunnel: false // only need to enable this if with a device not on the same wifi - crashes often so off by default
    });
});
// Watch files for changes and 
gulp.task('watch', function() {
    gulp.watch('src/**/*.js', ['bundleScripts']);
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/**/*.html', ['copy']);
    gulp.watch('src/**/*.json', ['copy']);
  
});

gulp.task('serve', function(callback) {
  runSequence('clean', ['copy', 'less','bundleScripts','watch'],
              'browser-sync',
              callback);
});
