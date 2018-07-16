import path from 'path';
import sourceMaps from 'rollup-plugin-sourcemaps';
import filesize from 'rollup-plugin-filesize';
import prettier from 'rollup-plugin-prettier';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import camelcase from 'camelcase';

const pkg = require('./package.json');

const libraryName = camelcase(pkg.name);
const input = path.resolve(__dirname, './__build/index.js');
const file = {
  main: pkg.main,
  module: pkg.module,
  browser: pkg.browser,
  browserMin: replaceExtension(pkg.browser, 'umd.min.js')
};

export default [
  {
    input,
    output: [
      { file: file.main, name: libraryName, format: 'cjs', sourcemap: false },
      { file: file.module, format: 'es', sourcemap: false },
      { file: file.browser, name: libraryName, format: 'umd', sourcemap: false }
    ],
    plugins: [
      prettier({
        parser: 'babylon',
        printWidth: 120,
        singleQuote: true
      }),
      filesize()
    ]
  },
  {
    input,
    output: [
      { file: file.browserMin, name: libraryName, format: 'umd', sourcemap: true }
    ],
    plugins: [
      compiler(),
      sourceMaps(),
      filesize()
    ]
  }
];

function replaceExtension(filePath, ext) {
  if (typeof filePath !== 'string') {
    return filePath;
  }

  if (filePath.length === 0) {
    return filePath;
  }

  const fileName = path.basename(filePath, path.extname(filePath)) + `.${ext}`;
  return path.join(path.dirname(filePath), fileName);
}
