'use strict';
var path=require('path');
var webpack=require('webpack');

var JS_PATH=path.resolve(__dirname,'./public/js/');
var components=path.resolve(JS_PATH,'components');
var node_modules=path.resolve(__dirname,'node_modules');

module.exports={
    resolve:{
        alias:{
            'js':path.resolve(__dirname,'./public/js'),
            'src':'js/src',
            'common':'src/common'
        },
        root:[
            components,
            node_modules
        ],
        extensions:['','.js','.jsx','.es6']
    },
    entry:{
        'photo/index':'src/photo/index.jsx',
    },
    output:{
        path:path.resolve(__dirname,'./public/js/'),
        publicPath:'/js/dist/',
        chunkFilename:'[name].chunk.js',
        filename:'[name].js'
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:'style-loader!css-loader!autoprefixer-loader'},
            {
                test:/\.jsx$/,
                loader:'babel',
                exclude: /(node_modules|bower_components)/,
                query:{
                    cacheDirectory:true,
                    presets:['es2015','react','stage-2'],
                    "plugins": ["transform-runtime"]
                }
            },
            {
                test:/\.es6$/,
                loader:'babel',
                exclude: /(node_modules|bower_components)/,
                query:{
                    cacheDirectory:true,
                    presets:['es2015','stage-2'],
                    "plugins": ["transform-runtime"]
                }
            },
            {test: /.(png|jpg)$/, loader: "url-loader?limit=10000"}
        ]
    },
    plugins:[
        // new webpack.optimize.CommonsChunkPlugin("./public/js/dist/react/common.js",[]),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        )
    ],
    devtool : '#scource-map'
}
