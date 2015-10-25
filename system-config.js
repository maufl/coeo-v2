System.config({
  defaultJSExtensions: true,
  meta: {
    'angular2/angular2': {
      build: false
    },
    'angular2/router': {
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
  }
});
