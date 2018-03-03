const path = require('path');
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const ENTRY = path.resolve(__dirname, './index.ts');
const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');
const LIB_NAME = 'isDatatype';

module.exports = function(_env) {
  const env = {
    min: !!_env && !!_env.min
  };

  const babelOptions = {
    presets: [
      [
        'env',
        {
          targets: {
            ie: 10,
            uglify: true
          },
          modules: false,
          loose: true
        }
      ]
    ]
  };

  const uglifyOptions = env.min
    ? {
        comments: false
      }
    : {
        compress: false,
        output: {
          beautify: true,
          indent_level: 2
        },
        mangle: false
      };

  return {
    mode: 'production',
    context: SRC_DIR,
    devtool: 'cheap-module-source-map',
    entry: {
      [LIB_NAME]: ENTRY
    },
    output: {
      path: path.resolve(DIST_DIR, './bundle'),
      filename: `[name].umd${env.min ? '.min' : ''}.js`,
      sourceMapFilename: '[file].map',
      library: LIB_NAME,
      libraryTarget: 'umd',
      pathinfo: false,
      globalObject: 'this'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions
            },
            {
              loader: 'ts-loader',
              options: {
                compilerOptions: {
                  declaration: false
                }
              }
            }
          ]
        },
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: [
            {
              loader: 'babel-loader',
              options: babelOptions
            }
          ]
        }
      ]
    },
    optimization: {
      noEmitOnErrors: true,
      minimize: true,
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            warnings: true,
            safari10: true,
            ...uglifyOptions
          }
        })
      ]
    },
    plugins: [env.min ? new CompressionPlugin({ test: /\.js/, asset: '[path].gz[query]' }) : null].filter(v => !!v),
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    }
  };
};
