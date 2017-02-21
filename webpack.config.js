const path = require('path');
const webpack = require('webpack');

const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');

module.exports = function(_env) {

  const env = {
    min: ( !!_env && !!_env.min )
  };

  const uglifyOptions = (
    env.min ?
    {
      compress: { warnings: false, screw_ie8: true },
      output: { comments: false },
      sourceMap: true,
      comments: false,
      mangle: { screw_ie8: true }
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
    devtool: 'cheap-module-source-map',
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
      new webpack.LoaderOptionsPlugin({
        minimize: ( env.min ),
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin(uglifyOptions)
    ],
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
  }
};
