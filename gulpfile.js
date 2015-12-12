var gulp = require('gulp');
var Builder = require('systemjs-builder');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');

var TS_PATHS = {
    src: __dirname + '/src/**/*.ts',
    typings: __dirname + '/typings/**/*.d.ts'
};

var BUILD_DIR = __dirname + '/build';
var DIST_DIR = __dirname + '/dist';

gulp.task('clean', function (done) {
    var del = require('del');
    del([BUILD_DIR, DIST_DIR], done);
});

gulp.task('ts2js', function () {
    var typescript = require('gulp-typescript');
    var tsResult = gulp.src([TS_PATHS.src, TS_PATHS.typings])
                       .pipe(typescript({
                           noImplicitAny: true,
                           suppressImplicitAnyIndexErrors: true,
                           module: 'system',
                           target: 'ES5',
                           moduleResolution: 'node',
                           emitDecoratorMetadata: true,
                           experimentalDecorators: true
                       }));

    return tsResult.js.pipe(gulp.dest(BUILD_DIR+'/app'));
});

gulp.task('jsDeps', function() {
    gulp.src([
        'node_modules/jquery/dist/jquery.js',
        'node_modules/systemjs/dist/system.js',
        'system-config.js',
        'node_modules/traceur/bin/traceur.js',
        'node_modules/materialize-css/dist/js/materialize.js',
        'node_modules/angular2/bundles/angular2.js',
        'node_modules/angular2/bundles/router.dev.js'
    ])
        .pipe(gulp.dest(BUILD_DIR+'/js'));
})

    gulp.task('sass', function() {
        gulp.src('src/styles/app.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest(BUILD_DIR+'/styles'));
    });

gulp.task('fonts', function() {
    gulp.src([
        'node_modules/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.{eot,ttf,woff,woff2}'
    ])
        .pipe(gulp.dest(BUILD_DIR+'/font'));
    gulp.src([
        'node_modules/roboto-fontface/fonts/Roboto-{Regular,Bold,Light}.{ttf,woff,woff2}'
    ])
        .pipe(gulp.dest(BUILD_DIR+'/font/roboto'));
});

gulp.task('index', function() {
    gulp.src('index.html')
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('build', ['ts2js', 'jsDeps', 'sass', 'fonts', 'index'], function() {});

gulp.task('play', ['build'], function () {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;


    gulp.watch(TS_PATHS.src, ['ts2js']);
    gulp.watch('src/**/*.scss', ['sass']);
    gulp.watch('index.html', ['index']);

    app = connect().use(serveStatic(BUILD_DIR));
    http.createServer(app).listen(port, function () {
        //open('http://localhost:' + port);
    });
});

gulp.task('release', ['build'], function() {
    var builder = new Builder(BUILD_DIR, 'system-config.js');

    builder.bundle('coeo/bootstrap.js', DIST_DIR + '/js/app.js', {
        sourceMaps: false,
        minify: false,
        mangle: false,
    }).then(function() {
        console.log("Build complete");
    }).catch(function(err) {
        console.log("Build error");
        console.log(err);
    });

    gulp.src([BUILD_DIR+'/**', '!'+BUILD_DIR+'/index.html', '!'+BUILD_DIR+'/app{,/**}'])
        .pipe(gulp.dest(DIST_DIR));
    gulp.src([BUILD_DIR+'/index.html'])
        .pipe(htmlreplace({
            js: [
                'js/app.js',
            ]
        }))
        .pipe(gulp.dest(DIST_DIR));
});
