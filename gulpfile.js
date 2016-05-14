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
//////////////////////////////////////////////////////////////////
// Concatenate & Minify JS

// Ignores files used for bundle task
// gulp.task('globalScripts', function() {
//     return gulp.src(['src/assets/js/global-scripts/*.js'])
//         .pipe(concat('global.js'))
//         .pipe(gulp.dest('build/assets/javascript'))
//         .pipe(rename('global.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('build/assets/javascript'))
//         .pipe(browserSync.stream({match: '**/**/*.js'}));
// });

// Uses bundle.config.js to find npm js files and bundles/uglifys them
gulp.task('bundleScripts', function() {
  return gulp.src('src/bundle.config.js')
    .pipe(bundle())
    .pipe(rename('global.js'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream({match: '**/**/*.js'}));
});
gulp.task('copy',  function () {
        return gulp.src(['src/**/*', '!src/**/*.js', '!src/less{,/**}'], {
            base: 'src'
        })
        .pipe(gulp.dest('app'))
        .pipe(browserSync.stream());
    });

// gulp.task('scripts', ['globalScripts', 'bundleScripts']);

gulp.task('less', function () {
  return gulp.src('src/less/**/*.less')
    .pipe(less({
      paths: [ './node_modules/bootstrap-less', path.join(__dirname, 'less', 'includes')]
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
        port: 8000,
        tunnel: false // only need to enable this if with a device not on the same wifi - crashes often so off by default
    });
});
// Watch files for changes and 
gulp.task('watch', function() {
    gulp.watch('src/*.js', ['bundleScripts']);
    gulp.watch('src/**/*.less', ['less']);
    gulp.watch('src/*.html', ['copy']);
    gulp.watch('src/**/*.json', ['copy']);
  
});

gulp.task('serve', function(callback) {
  runSequence('clean', ['copy', 'less','bundleScripts','watch'],
              'browser-sync',
              callback);
});