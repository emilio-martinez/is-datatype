module.exports = function (config) {
  config.set({

    frameworks: [ 'jasmine', 'karma-typescript' ],

    files: [{
      pattern: 'src/**/*.ts'
    }],

    preprocessors: {
      '**/*.ts': [ 'karma-typescript' ]
    },

    reporters: [ 'progress', 'karma-typescript' ],

    mime: {
      'text/x-typescript': [ 'ts','tsx' ]
    },

    karmaTypescriptConfig: {
      reports: {
        'html': 'coverage',
        // destination ' will redirect output to the console
        'text-summary': ''
      }
    },

    browsers: ['PhantomJS'], // Chrome
    concurrency: 1
  });
};