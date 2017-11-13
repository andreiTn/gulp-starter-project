const gulp = require('gulp');
const gutil = require('gulp-util');
const args = require('yargs').argv;
const combineMq = require('gulp-combine-mq');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const chalk = require('chalk');

const config = {
    cssSrc: {
        vendor: 'web/assets/vendor/',
        css: 'web/assets/scss/'
    },
    cssDest: 'web/css',
    jsSrc: {
        vendor: 'web/assets/vendor/',
        js: 'web/assets/js/'
    },
    jsDest: 'web/js',
    fonts: {
        src: 'web/assets/vendor/',
        dest: 'web/fonts'
    },
    production: !!gutil.env.production
};

// ENV info
{
    let message = '';
    if(!config.production) {
        message = chalk.magenta.bold(
            'Running ' +
            chalk.green('gulp') +
            'To minify assets, run ' +
            chalk.green('gulp --production')
        );
    } else {
        message = chalk.cyan(
            'Running ' +
            chalk.green('gulp --production') +
            ' . All assets will be minified.'
        );
    }
    console.log(message);
};

//------------------------------------------------------------------------
// Vendor css
//------------------------------------------------------------------------
gulp.task('vendor-css', function() {

    return gulp.src([
            config.cssSrc.css + 'bootstrap.scss',
            config.cssSrc.vendor + 'font-awesome/scss/font-awesome.scss'
        ])
        .pipe(sass({
            outputStyle: 'compressed',
            precision: 5
        }).on('error', sass.logError))
        .pipe(combineMq())
        .pipe(config.production ? cssnano({ discardComments: { removeAll: true } }) : gutil.noop())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(config.cssDest));
});

//------------------------------------------------------------------------
// CSS
//------------------------------------------------------------------------
gulp.task('css', function() {
    gulp.src([
        config.cssSrc.css + 'main.scss'
    ])
    .pipe(sass({
        outputStyle: 'expanded',
        precision: 5
    }).on('error', sass.logError))
    .pipe(combineMq())
    .pipe(concat('style.css'))
    .pipe(config.production ? cssnano({ discardComments: { removeAll: true } }) : gutil.noop())
    .pipe(gulp.dest(config.cssDest));
});

//------------------------------------------------------------------------
// Vendor JS
//------------------------------------------------------------------------
gulp.task('vendor-js', function() {
    gulp.src([
        config.jsSrc.vendor + 'jquery/dist/jquery.min.js',
    ])
    .pipe(config.production ? uglify() : gutil.noop())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(config.jsDest));
});
//------------------------------------------------------------------------
// Chv main JS
//------------------------------------------------------------------------
gulp.task('js', function() {
    gulp.src([
        config.jsSrc.js + '/**/*.js',
        config.jsSrc.js + '/*.js'
    ])
    .pipe(concat('script.js'))
    .pipe(config.production ? uglify({mangle: true}) : gutil.noop())
    .pipe(gulp.dest(config.jsDest));
});

//------------------------------------------------------------------------
// Watch
//------------------------------------------------------------------------
gulp.task('watch', function() {
    if (!config.production) {
        gulp.watch([
            config.cssSrc.css + '**/*.scss',
        ], function() { gulp.start('css') });
        gulp.watch([
            config.jsSrc.js + '/**/*.js',
        ], function() {
            gulp.start('js');
        });
    }
});


//------------------------------------------------------------------------
// Fonts
//------------------------------------------------------------------------
gulp.task('fonts', function() {
    gulp.src([
        config.fonts.src + 'font-awesome/fonts/fontawesome-webfont.*'
    ])
    .pipe(gulp.dest(config.fonts.dest));
});


//------------------------------------------------------------------------
// Global
//------------------------------------------------------------------------

gulp.task('default', ['fonts', 'vendor-js', 'vendor-css', 'css', 'js', 'watch']);

gulp.task('prod', ['fonts', 'vendor-js', 'vendor-css', 'css', 'js']);

