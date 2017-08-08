/// <binding />
var gulp = require("gulp");

// Plugins for CSS compoling
var sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cleanCSS     = require('gulp-clean-css'),
    rename       = require('gulp-rename'),
    mmq          = require('gulp-merge-media-queries');

gulp.task("default", ['stylesheets', 'fonts', 'mathfonts']);

// Compile Stylesheets
gulp.task('stylesheets', function() {
    return gulp.src('./samples/Client/stylesheets/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(mmq({log: false}))
        .pipe(autoprefixer({browsers: ['> 2%', 'last 2 versions'], cascade: false}))
        .pipe(gulp.dest("./samples/wwwroot/css"))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./samples/wwwroot/css"))
});

// Compile fonts
gulp.task('fonts', function() {
    return gulp.src('./Client/fonts/**/*')
        .pipe(gulp.dest("./samples/wwwroot/fonts"))
});

gulp.task('mathfonts', function() {
    return gulp.src('./node_modules/katex/dist/fonts/**/*')
        .pipe(gulp.dest("./samples/wwwroot/fonts"))
});

// Watch Stylesheets
gulp.task('watch', function(callback) {
    gulp.watch('./Client/stylesheets/**/*.scss', ['stylesheets', 'fonts']);
});
