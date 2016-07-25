var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload'),
    runSequence = require('run-sequence'),
    exec = require('child_process').exec;

function runCommand(command) {
    return function(cb) {
        exec(command, function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            cb(err);
        });
    }
}


// Running mongoDB for server
gulp.task('start-mongo', runCommand('mongod --dbpath ./server/data/'));
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
 
gulp.task('server', function(callback) {
    runSequence(['start-mongo', 'start-server'],
        callback);
});