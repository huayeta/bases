'use strict';
var path=require('path');
var webpack=require('webpack');

var JS_PATH=path.resolve(__dirname,'./public/js/');
var bower_components=path.resolve(JS_PATH,'bower_components');
var node_modules=path.resolve(__dirname,'node_modules');
var date=Date.now();

var isProduction = function () {
  return process.env.NODE_ENV === 'production';
}

var plugins=[
    // new webpack.optimize.CommonsChunkPlugin("./public/js/dest/react/common.js",[]),
    // new webpack.ProvidePlugin({
    //     React:'react',
    //     ReactDom:'react-dom',
    //     jquery:'jquery'
    // }),
    new webpack.ResolverPlugin(
        new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),
    new webpack.ProvidePlugin({
       'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
]
if(isProduction()){
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test:/(\.jsx|\.js|\.es6)$/,
            compress:{
                warnings:false
            }
        })
    )
}

module.exports={
    resolve:{
        alias:{
            'js':path.resolve(__dirname,'./public/js'),
            'src':'js/src',
            'common':'src/common'
        },
        root:[
            bower_components,
            node_modules
        ],
        extensions:['','.js','.jsx','.es6']
    },
    entry:{
        'photo/index':'src/photo/index.jsx',
        'index/m.index':'src/index/m.index.jsx',
        'test/index':'src/test/index.jsx',
    },
    output:{
        path:path.resolve(__dirname,'./public/js/'),
        publicPath:'/js/dest/',
        chunkFilename:date+'[name].chunk.js',
        filename:'[name].js'
    },
    module:{
        loaders:[
            {test:/\.css$/,loader:'style-loader!css-loader!postcss-loader'},
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
    postcss:function(){
        return [
            require('autoprefixer'),
            require('process')
        ];
    },
    plugins:plugins,
    devtool : isProduction()?null:'source-map'
}
