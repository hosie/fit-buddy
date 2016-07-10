var gulp = require('gulp');
var gulpMocha = require('gulp-mocha');
var Server = require('karma').Server;
var istanbul = require('gulp-istanbul');

var paths = {
    serverCode: ['app.js','exercises/**/*.js','persistence/**/*.js', 'routes/**/*.js'],
    serverTests: ['test/server/**/*.js'],
    clientCode: 'public/javascripts/**/*.js',
    clientTests: 'test/client/**/*.js',
    e2eTests: ['features/exercises.feature'],
    e2eJs: ['features/**/*.js']
};

gulp.task('default', function() {
    // place code for your default task here
});


gulp.task('test', ['lint','server-test', 'client-test'], function() {

});


var jshintSummary = require('jshint-stylish-summary');
var jshint = require('gulp-jshint');

gulp.task('lint', function() {
    return gulp.src(['*.js'].concat(paths.serverCode).concat(paths.serverTests).concat(paths.clientCode).concat(paths.e2eJs).concat(paths.clientTests))
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
    .pipe(jshintSummary.collect())
    .on('end',jshintSummary.summarize());

});

gulp.task('pre-server-test', function () {
    return gulp.src(paths.serverCode)
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

function serverTest() {
    return gulp.src(paths.serverTests, {read: false})
        .pipe(gulpMocha({
            bail:true
        }));
}

gulp.task('server-test', ['pre-server-test'], function() {
    return serverTest()
    .pipe(istanbul.writeReports({
        dir: './coverage/server',
        reporters: ['cobertura','html']
    }))
    // Enforce a coverage of at least 90%
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 0 } }));
});

gulp.task('server-test-nocoverage', function() {
    return serverTest();
});

gulp.task('client-test', function(done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});

gulp.task('e2e-test', function() {
    var protractor = require("gulp-protractor").protractor;

    return gulp.src(paths.e2eTests)
    .pipe(protractor({
        configFile: "./protractor-conf.js"
    }))
    .on('error', function(e) {
        throw e;
    });

});