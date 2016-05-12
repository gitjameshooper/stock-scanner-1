var gulp = require('gulp'),
    gutil = require('gulp-util'),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    browserify = require('browserify'),
   runSequence = require('run-sequence'),
     browserSync = require('browser-sync').create();

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

// // Uses bundle.config.js to find npm js files and bundles/uglifys them
// gulp.task('bundleScripts', function() {
//   return gulp.src('src/assets/js/global-admin/bundle.config.js')
//     .pipe(bundle())
//     .pipe(rename('global.js'))
//     .pipe(gulp.dest('app/js'));
// });

// gulp.task('scripts', ['globalScripts', 'bundleScripts']);

gulp.task('browser-sync', function() {
    browserSync.init({
        reloadDebounce: 5000,
        server: "./build",
        port: 8000,
        tunnel: false // only need to enable this if with a device not on the same wifi - crashes often so off by default
    });
});
gulp.task('watch', function() {
    gulp.watch('app/*.js');
    gulp.watch('app/*.css');
    gulp.watch('app/*.html');
  
});

gulp.task('serve', function(callback) {
  runSequence(['watch'],
              'browser-sync',
              callback);
});