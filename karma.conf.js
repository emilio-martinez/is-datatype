const jsdomVersion = require('jsdom/package.json').version;

module.exports = function (config) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],

    files: [{
      pattern: '{spec,src}/**/*.ts'
    }],

    preprocessors: {
      '**/*.ts': ['karma-typescript']
    },

    reporters: ['progress', 'karma-typescript'],

    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },

    karmaTypescriptConfig: {
      coverageOptions: {
        instrumentation: true,
        // exclude: /\.(d|spec|test)\.ts/i,
        threshold: {
          global: {
            statements: 95,
            branches: 95,
            functions: 95,
            lines: 95
          },
          file: {
            statements: 95,
            branches: 95,
            functions: 95,
            lines: 95
          }
        },
      },
      reports: {
        html: {
          directory: 'coverage',
          subdirectory: '.'
        },
        lcovonly: {
          directory: 'coverage',
          subdirectory: '.',
          filename: 'lcov.info'
        },
        json: {
          directory: 'coverage',
          subdirectory: '.',
          filename: 'coverage-final.json'
        },
        // destination ' will redirect output to the console
        'text-summary': ''
      },
      tsconfig: './tsconfig.spec.json'
    },

    jsdomLauncher: {
      jsdom: {
        userAgent: `jsdom/${jsdomVersion}`
      }
    },

    browsers: ['jsdom'],
    concurrency: 1
  });
};