var gulp = require('gulp'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    scsslint = require('gulp-scss-lint'),
    concat = require('gulp-concat'),
    eslint = require('gulp-eslint'),
    uglify = require('gulp-uglify');
    browserSync = require('browser-sync');
    nodemon = require('gulp-nodemon');

var paths = {
    js: 'app/views',
    sass: 'app/assets/scss',
    devCss: 'app/css',
    devJs: 'app/js',
    devViews: 'app/views',
    devServerFiles:'server',
    buildServerFiles:'build/server',
    buildCss: 'build/app/css',
    buildJs: 'build/app/js',
    buildViews: 'build/app/views'
};

var jsFiles = [
    paths.js + '/**/*.js'
];

gulp.task('eslint', function () {
    return gulp.src(watch.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('js', function () {
    return gulp.src(jsFiles)
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(paths.devJs));
});

gulp.task('sass', function () {
    return gulp.src(paths.sass + '/app.scss')
        .pipe(sass())
        .pipe(cssnano({
            keepSpecialComments: 1,
            rebase: false,
            zindex: false
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(paths.devCss));
});

gulp.task('scss-lint', function () {
    return gulp.src(paths.sass + '/**/*.scss')
        .pipe(scsslint());
});

gulp.task('copy:css-build', [], function() {
    gulp.src([paths.devCss + '/*'])
        .pipe(gulp.dest(paths.buildCss));
});

gulp.task('copy:js-build', [], function() {
    gulp.src([paths.devJs + '/*'])
        .pipe(gulp.dest(paths.buildJs));
});

gulp.task('copy:module-build', [], function() {
    gulp.src([paths.devViews + '/**/*.html'])
        .pipe(gulp.dest(paths.buildViews));
});

gulp.task('copy:server-build', [], function() {
    gulp.src([paths.devServerFiles + '/**/*'])
        .pipe(gulp.dest(paths.buildServerFiles))

    gulp.src(['app.js'])
        .pipe(gulp.dest('build'));

    gulp.src(['package.json'])
        .pipe(gulp.dest('build'));

    gulp.src(['bin/*'])
        .pipe(gulp.dest('build/bin'));
});


var watch = {
    js: [
        paths.js + '/**/*.js'
    ],
    sass: [
        paths.sass + '/**/*.scss'
    ]
};

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["app/**/*.*"],
        port: 7000,
    });
});

gulp.task('nodemon', function (cb) {

    var started = false;

    return nodemon({
        script: './bin/www',
        watch: [
            'server/routes/'
        ]
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watch', function () {
    gulp.watch(watch.sass, { interval: 500 }, ['sass']);
    gulp.watch(watch.js, { interval: 500 }, ['js']);
});

gulp.task('default', ['watch', 'browser-sync']);
gulp.task('build:serve', ['copy:css-build', 'copy:js-build', 'copy:module-build', 'copy:server-build']);
gulp.task('build:dev', ['sass', 'js']);
