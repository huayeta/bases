var gulp=require("gulp");
var del=require('del');
var webpack=require('webpack');
var gulpWebpack=require('webpack-stream');
var shell=require('gulp-shell');
var postcss=require('gulp-postcss');
var sourcemaps=require('gulp-sourcemaps');
var combine=require('stream-combiner');

var BASE='./public/js/';
var BASE_CSS='./public/wap/';

gulp.task('default',['start']);

//清除任务
gulp.task('clean',function(cb){
    del([BASE+'dest/']).then((path)=>{
        console.log(path);
        cb();
    })
})

// 开始任务
gulp.task('start',shell.task([
    'gulp webpack-w'
]))

//发布任务
gulp.task('publish',['clean'],function(cb){
    shell.task([
        'NODE_ENV="production" gulp webpack'
    ])(cb);
})

//postcss
//插件
var processors=[
    require('postcss-import'),//合并@import的样式到主样式里面
    // require('cssnext'),
    require('precss'),//预处理语言
    require('postcss-will-change'),//提前动画
    require('postcss-color-rgba-fallback'),//rgba的兼容
    require('postcss-opacity'),//opacity的兼容
    require('postcss-pseudoelements'),//::伪元素的兼容
    require('postcss-vmin'),//vmin单位的兼容
    require('pixrem'),//rem单位的兼容
    require('css-mqpacker'),//合并媒体查询的样式
    require('autoprefixer'),//自动添加前缀
    require('cssnano'),//压缩合并优化
];
var base_postcss=[
    BASE_CSS+'src/*.css',
    BASE_CSS+'src/**/*.css',
];
gulp.task('postcss',function(){
    return gulp.src(base_postcss)
        .pipe(combine(
            sourcemaps.init(),
            postcss(processors),
            sourcemaps.write('.')
        ))
        .pipe(gulp.dest('./public/wap/dest'))
})
gulp.task('postcss-w',['postcss'],function(){
    gulp.watch(base_postcss,['postcss']);
})
gulp.task('postcss-clean',function(cb){
    del([BASE_CSS+'dest/']).then((path)=>{
        console.log(path);
        cb();
    })
})
gulp.task('postcss-start',['postcss-clean'],function(cb){
    shell.task([
        'gulp postcss-w'
    ])(cb);
})

//webpack
var Base_webpack=[
    BASE+'src/*.jsx',
    BASE+'src/*.es6',
    BASE+'src/*.css',
    BASE+'src/**/*.jsx',
    BASE+'src/**/*.es6',
    BASE+'src/**/*.css',
];

// NODE_ENV=production gulp webpack
gulp.task('webpack',function(){
    gulp.src(BASE)
        .pipe(gulpWebpack(require('./webpack.config.js'),webpack))
        .pipe(gulp.dest('./public/js/dest'))
});
gulp.task('webpack-w',function(){
    gulp.watch(Base_webpack,['webpack']);
});
