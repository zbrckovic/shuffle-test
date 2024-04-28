const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = (env, argv) => {
    const mode = argv.mode || 'production'
    const BACKEND = env.BACKEND || '/'
    const [gitHash, gitDate] = extractGitHashAndDate()

    const isDevelopment = mode === 'development'

    return ({
        mode,
        entry: './src/index.tsx',

        devServer: {
            historyApiFallback: true,
            port: 8080
        },
        output: {
            publicPath: isDevelopment ? '/' : '/shuffle-test/',
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].[contenthash].js'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            modules: [
                path.resolve(__dirname, './node_modules'),
                path.resolve(__dirname, './src')
            ],
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader'
                },
                {
                    test: /\.css$/i,
                    use: ['style-loader', 'css-loader', 'postcss-loader'],
                },
                {
                    test: /\.(png|jpg|gif|xml)$/i,
                    type: 'asset/resource'
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({template: './src/index.html'}),
            new webpack.DefinePlugin({
                'process.env.BACKEND': JSON.stringify(BACKEND),
                'process.env.VERSION': JSON.stringify(pkg.version),
                'process.env.MODE': JSON.stringify(mode),
                'process.env.GIT_COMMIT_HASH': JSON.stringify(gitHash),
                'process.env.GIT_COMMIT_DATE': JSON.stringify(gitDate),
            })
        ]
    })
}

const extractGitHashAndDate = () =>
    require('child_process')
        .execSync('git log -1 --format="%h|%aI"')
        .toString()
        .trim()
        .split('|')
