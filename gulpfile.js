// Modules 호출
var gulp = require('gulp');

// Gulp의 concat 패키지 모듈 호출
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Gulp.task() 를 사용해 기본 (Default) 테스크를 정의
gulp.task('js', function () {
    return gulp
        .src('project/assets/js/**/*.js')
        // .pipe(concat('conbined.js')) 하나의 js파일로 병합
        // .pipe(gulp.dest('project/dist/assets/js'));
        // .pipe(uglify()) js파일 압축
        // .pipe(renmae('combined.min.js)) js 압축파일 이름 변경
        .pipe(gulp.dest('project/dist/assets/js'));
});

gulp.task('sass', function () {
    return gulp
        .src('project/assets/scss/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest('project/assets/css'))
});

gulp.task('watch', function () {
    // gulp.watch('project/src/assets/js/**/*.js', ['js']);
    gulp.watch('project/assets/scss/**/*.scss', ['sass'])
});

gulp.task('default', [
    'sass',
    'watch'
])