var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    runSequence = require('run-sequence'),
    exec = require('child_process').exec,
    rename = require('gulp-rename'),
    bundle = require('gulp-bundle-assets'),
    del = require('del'),
    less = require('gulp-less'),
    path = require('path');

function runCommand(command) {
    return function(cb) {
        exec(command, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}

//// Client Side ////
gulp.task('clean', function() {
    return del(['public']);
});

// Uses bundle.config.js to find npm js files and bundles/uglifys them
gulp.task('bundleScripts', function() {
    return gulp.src('client/bundle.config.js')
        .pipe(bundle())
        .pipe(rename('global.js'))
        .pipe(gulp.dest('public/js'))
        .pipe(livereload());
});
// copy all other files needed to app
gulp.task('copy', function() {
    return gulp.src(['client/**/*', '!client/**/*.js', '!client/less{,/**}', 'node_modules/font-awesome/fonts{,/**}'])
        .pipe(gulp.dest('public'))
        .pipe(livereload());
});


gulp.task('less', function() {
    return gulp.src('client/less/global.less')
        .pipe(less({
            paths: ['./node_modules/bootstrap-less', './node_modules/font-awesome/less', path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(rename('global.css'))
        .pipe(gulp.dest('public/css'))
        .pipe(livereload());
});


// Watch files for changes and 
gulp.task('watch', function() {
    gulp.watch('client/**/*.js', ['bundleScripts']);
    gulp.watch('client/**/*.less', ['less']);
    gulp.watch('client/**/*.html', ['copy']);
    gulp.watch('client/**/*.json', ['copy']);

});


//// Server Side ////

// Running mongoDB for server
gulp.task('start-mongo', runCommand('mongod --dbpath=./server/data'));
gulp.task('stop-mongo', runCommand('killall mongod'));

// Start Server and Watch for File changes
gulp.task('start-server', function() {
    // listen for changes
    livereload.listen();

    nodemon({
            script: 'server/index.js',
            ext: 'js'
        })
        .on('restart', function() {
            gulp.src('server/index.js')
                .pipe(livereload());
        })

});
gulp.task('serve', function(callback) {
    runSequence('clean', ['copy', 'less', 'bundleScripts', 'watch'],['start-mongo', 'start-server'],
        callback);
});
