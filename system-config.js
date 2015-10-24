System.config({
  defaultJSExtensions: true,
  meta: {
    'angular2/angular2': {
      format: 'register',
      build: false
    },
    'angular2/router': {
      format: 'register',
      build: false
    }
  },
  transpiler: 'traceur',
  paths: {
    '*': 'node_modules/*',
    'coeo/*': 'dist/*'
  },
  map: {
    traceur: 'traceur/bin/traceur.js',
    'angular2/router': 'angular2/bundles/router.dev.js',
    'angular2/angular2': 'angular2/bundles/angular2.js'
  }
});
