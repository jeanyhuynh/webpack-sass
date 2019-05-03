const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const sourceMainCss = 'assets/css/main.css'
const mode =process.env.NODE_ENV;
const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
    entry: path.join(__dirname,'src', 'index.js'),
    output: {
        path: path.join(__dirname,'dist'),
        filename: "[name].bundle.js"
    },
    mode: mode,
    module: {
        rules: [
            {
            test: /\.(js)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
            },
            {
                test:  /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                loader: "file-loader",
                options: {
                    name: '[name].[hash:7].[ext]',
                    outputPath: "assets/images/"
                }
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets/fonts/'
                    }
                }]
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        extensions: ['*', '.js', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname,'src', 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: sourceMainCss
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [
                    autoprefixer()
                ]
            }
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery:'jquery',
            'window,jQuery': 'jquery',
            jQuery: 'jquery',
            Popper: ['popper.js', 'default'],
        })
    ]
};
if(isDevMode){

    module.exports.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
    )
    module.exports.module.rules.push(
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader',
                'postcss-loader',
                'sass-loader'
            ]
        }
    )
    module.exports.devServer = {
        contentBase: path.join(__dirname, 'src'),
        compress: true,
        hot: true,
        open: true,
        port: 1800
    }
    module.exports.devtool = 'source-map'
}
else{
    module.exports.plugins.push(
        new CleanWebpackPlugin({}),
        new MiniCssExtractPlugin({
            filename: sourceMainCss,
            chunkFilename: "assets/css/[name].css"
        }),
        new OptimizeCSSAssetsPlugin({}),

    );
    module.exports.module.rules.push(
        {
            test: /\.(sa|sc|c)ss$/,
            use: [
                MiniCssExtractPlugin.loader,
                { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
                { loader: 'sass-loader', options: { sourceMap: true } },
                "postcss-loader"
            ],
        }
    );
    module.exports.optimization = {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'main',
                    chunks: 'all',
                    filename: 'common.bundle.js'
                }
            }
        }
    }
}