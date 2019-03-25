var gulp = require('gulp');
var path = require('path');
var del = require('del');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var fileinclude = require('gulp-file-include');
var browserSync = require('browser-sync').create();

gulp.task('server', ['allfile', 'html', 'scss'], function () {
    browserSync.init({
        port: 1234,
        server: {
            baseDir: 'project/dist'
        }
    });
    gulp.watch([
        'project/src/**/*.*',
        '!project/src/**/*.html',
        '!project/src/views/@include/**/*',
        '!project/src/**/*.scss'
    ], ['allfile']);
    gulp.watch('project/src/**/*.html', ['html']);
    gulp.watch('project/src/assets/scss/**/*.scss', ['scss']);
    gulp.watch('project/src/**', function (e) {
        if (e.type === 'deleted') {
            var filePathFromSrc = path.relative(path.resolve('project/src/'), e.path);
            var destFilePath = path.resolve('project/dist/', filePathFromSrc);
            del.sync(destFilePath);
        }
    });
    gulp.watch('project/dist/**/*.*', browserSync.reload);
});

gulp.task('allfile', function () {
    return gulp
        .src([
            'project/src/**/*.*',
            '!project/src/**/*.html',
            '!project/src/views/@include/**/*',
            '!project/src/**/*.scss'
        ])
        .pipe(gulp.dest('project/dist'))
});

gulp.task('html', function () {
    return gulp
        .src('project/src/**/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: './project/src/'
        }))
        .pipe(gulp.dest('project/dist'))
});

gulp.task('scss', function () {
    return gulp
        .src('project/src/assets/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('project/src/assets/css'))
});

gulp.task('clean', function () {
    return del('project/dist');
});

gulp.task('default', ['server']);