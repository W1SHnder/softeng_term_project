const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // Import webpack module

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
        new webpack.HotModuleReplacementPlugin(), // Add HMR plugin
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    devServer: {
	static: {
            directory: path.join(__dirname, 'dist'),
	},
        port: 3000,
        hot: true, 
    },
};
