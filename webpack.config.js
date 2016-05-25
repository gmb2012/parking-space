var path = require('path'),
    targetPath = path.join(__dirname, 'public', 'javascript'),
    webpack = require('webpack'),
    config;

var env = {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
};

config = {
    resolve: {
        extensions: [ '', '.js', '.jsx' ]
    },
    entry: {
    },
    output: {
        path: targetPath,
        filename: '[name]-bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    require.resolve('babel-loader')
                ]
            },
            { test: /\.json$/, loader: 'json-loader' }
        ]
    },
    plugins: [
       new webpack.DefinePlugin({'process.env': env})
    ]
};

module.exports = config;
