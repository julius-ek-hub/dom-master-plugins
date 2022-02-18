const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
    module:{
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader']
            }
        ]
    },
  output: {
    filename: 'dom-master-plugins.bundle.min.js',
    path: path.resolve(__dirname, 'dist/css')
  },
  optimization:{
    minimizer:[new CssMinimizerPlugin()]
  }
};