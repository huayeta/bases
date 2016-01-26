var gulp=require("gulp");
var combiner=require('stream-combiner2');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var rename=require('gulp-rename');
var del=require('del');
var changed=require('gulp-changed');
var babel=require('gulp-babel');
var sequence=require('gulp-sequence');//顺序or并行执行任务
var jshint=require('gulp-jshint');
var webpack=require('webpack');
var gulpWebpack=require('webpack-stream');
var sourcemaps=require('gulp-sourcemaps');

var BASE='./public/js/';

//babel
var BABELDEST='./public/js/build/';
var BABELSRC=['./public/js/*/*.es6','./public/js/*/*.jsx'];
gulp.task('clean:babel',function(cb){
    del(BABELDEST).then(function(paths){
        cb();
    });
});
gulp.task('babel',function(){
    var combined=combiner.obj([
        gulp.src(BABELSRC),
        changed(BABELDEST),
        babel(),
        uglify(),
        rename(function(path){
            path.extname='.min.js';
        }),
        gulp.dest(BABELDEST)
    ]);
    combined.on('error',console.log.bind(console));
    return combined;
});
gulp.task('w-babel',function(){
    gulp.watch(BABELSRC,['babel']);
});
//clean
gulp.task('clean',['clean:babel']);
//build
gulp.task('build',sequence('clean:babel','babel'));
//watch
gulp.task('watch',['w-babel']);
//default
// gulp.task('default',['build']);

//lint
gulp.task('lint',function(){
    gulp.src(BASE+'react/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

gulp.task('clean-dest',function(cb){
    del(BASE+'dest/').then(function(paths){
        cb();
    });
})

var Base_webpack=[
    BASE+'src/*.jsx',
    BASE+'src/*.es6',
    BASE+'src/**/*.jsx',
    BASE+'src/**/*.es6',
    BASE+'src/**/*.css',
];

// NODE_ENV=production gulp webpack
gulp.task('webpack',function(){
    gulp.src(BASE)
        .pipe(gulpWebpack(require('./webpack.config.js'),webpack))
        // .pipe(gulp.dest('./'))
        // .pipe(rename(function(path){
        //     path.extname='.min.js';
        // }))
        // .pipe(sourcemaps.init())
        // .pipe(uglify())
        // .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./public/js/dest'))
});
gulp.task('webpack-w',function(){
    gulp.watch(Base_webpack,['webpack']);
});
