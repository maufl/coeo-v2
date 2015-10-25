var gulp = require('gulp');
var Builder = require('systemjs-builder');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');

var PATHS = {
    src: 'src/**/*.ts',
    typings: 'node_modules/angular2/bundles/typings/angular2/angular2.d.ts'
};

gulp.task('clean', function (done) {
    var del = require('del');
  del(['dist', 'build'], done);
});

gulp.task('ts2js', function () {
    var typescript = require('gulp-typescript');
    var tsResult = gulp.src([PATHS.src, PATHS.typings])
        .pipe(typescript({
            noImplicitAny: true,
            module: 'system',
            target: 'ES5',
            emitDecoratorMetadata: true,
            experimentalDecorators: true
        }));

    return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('play', ['ts2js'], function () {
    var http = require('http');
    var connect = require('connect');
    var serveStatic = require('serve-static');
    var open = require('open');

    var port = 9000, app;

    gulp.watch(PATHS.src, ['ts2js']);

    app = connect().use(serveStatic(__dirname));
    http.createServer(app).listen(port, function () {
        open('http://localhost:' + port);
    });
});

gulp.task('build', ['ts2js'], function() {
  var builder = new Builder('.', 'system-config.js');

  builder.bundle('coeo/bootstrap.js', 'build/js/app.js', {
    sourceMaps: false,
    minify: false,
    mangle: false,
  })
    .then(function() {
      console.log("Build complete");
    })
    .catch(function(err) {
      console.log("Build error");
      console.log(err);
    });

  gulp.src([
    'node_modules/systemjs/dist/system.js',
    'node_modules/traceur/bin/traceur.js',
    'node_modules/materialize-css/dist/js/materialize.js',
    'node_modules/angular2/bundles/angular2.js',
    'node_modules/angular2/bundles/router.dev.js'
  ])
    .pipe(gulp.dest('build/js'));
  gulp.src(['node_modules/materialize-css/dist/css/materialize.css'])
    .pipe(gulp.dest('build/css'));
  gulp.src(['index.html'])
    .pipe(htmlreplace({
      js: [
        'js/traceur.js',
        'js/system.js',
        'js/angular2.js',
        'js/router.dev.js',
        'js/app.js',
        'js/materialize.js'
      ],
      css: {
        src: 'css/materialize.css',
        tpl: '<link rel="stylesheet" href="%s" media="screen,projection" />'
      }
    }))
    .pipe(gulp.dest('build'));
});
