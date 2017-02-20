const path = require('path');
const webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');

module.exports = function(_env) {

  const env = {
    min: ( _env && _env.min ?  true : false )
  };

  const uglifyOptions = (
    env.min ?
    {
      compress: { warnings: false },
      output: { comments: false },
      sourceMap: true,
      comments: false,
      mangle: true
    } :
    {
      compress: false,
      output: { comments: false },
      sourceMap: true,
      comments: false,
      mangle: false,
      beautify: true
    }
  )

  return {
    context: SRC_DIR,
    devtool: 'source-map',
    entry: {
      'is.func': path.resolve(SRC_DIR, './is.func.ts')
    },
    output: {
      path: path.resolve(DIST_DIR, './bundle'),
      filename: `[name].umd${( env.min ? '.min' : '' )}.js`,
      sourceMapFilename: '[file].map',
      libraryTarget: 'umd',
      pathinfo: false
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              module: 'ES2015',
              declaration: false
            }
          }
        }
      ]
    },
    plugins: [
      new webpack.LoaderOptionsPlugin({ minimize: ( env.min ) }),
      new webpack.optimize.UglifyJsPlugin(uglifyOptions)
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
  }
};
