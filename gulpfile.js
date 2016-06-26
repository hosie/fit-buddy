var gulp = require('gulp');
var mocha = require('gulp-mocha');
var Server = require('karma').Server;
var istanbul = require('gulp-istanbul');

var paths = {
    serverCode: ['app.js','exercises/**/*.js','persistence/**/*.js'],
    serverTests: ['test/server/**/*.js'],
    clientCode: 'client/img/**/*'
};

gulp.task('default', function() {
    // place code for your default task here
});

gulp.task('test', ['server-test', 'client-test'], function() {

});

gulp.task('pre-server-test', function () {
    return gulp.src(paths.serverCode)
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('server-test', ['pre-server-test'], function() {
    return gulp.src(paths.serverTests, {read: false})
    .pipe(mocha())
    .pipe(istanbul.writeReports({
        dir: './coverage/server',
        reporters: ['cobertura','html']
    }))
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 0 } }));
});

gulp.task('client-test', ['server-test'], function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});