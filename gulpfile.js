const autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  eslint = require('gulp-eslint'),
  focus = require('postcss-focus'),
  gulp = require('gulp'),
  imagemin = require('gulp-imagemin'),
  pixrem = require('pixrem'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  stylelint = require('gulp-stylelint'),
  uglify = require('gulp-uglify');

const paths = {
  html5shiv: 'node_modules/html5shiv/dist/html5shiv.min.js',
  css: {
    src: {
      main: 'src/scss/main.scss',
      files: 'src/scss/**/*.scss'
    },
    dist: 'dist/css/'
  },
  js: {
    src: 'src/js/**/*.js',
    dist: 'dist/js/'
  },
  images: {
    src: 'src/images/',
    dist: 'dist/images/'
  }
};

gulp.task('lintCss', () => {
  gulp
    .src(paths.css.src.files)
    .pipe(
      stylelint({reporters: [{formatter: 'string', console: true}]})
    );
});

gulp.task('css', () => {
  gulp
    .src(paths.css.src.main)
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss([pixrem(), focus()]))
    .pipe(autoprefixer('last 4 versions', '> 5%'))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.css.dist));
});

gulp.task('lintJs', () => {
  gulp
    .src(paths.js.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('js', () => {
  gulp
    .src(paths.js.src)
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('main.min.js'))
    .pipe(uglify({mangle: true, compress: true}))
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('html5shiv', () => {
  gulp
    .src(paths.html5shiv)
    .pipe(gulp.dest(paths.js.dist));
});

gulp.task('images', () => {
  gulp
    .src(paths.images.src)
    .pipe(
      imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        svgoPlugins: {removeViewBox: true}
      })
    )
    .pipe(gulp.dest(paths.images.dist));
});

gulp.task('watch', () => {
  gulp.watch(
    paths.css.src.files, ['lintCss', 'css']
  );
  gulp.watch(
    paths.js.src, ['lintJs', 'js']
  );
});


gulp.task('default', [
  'lintCss', 'css', 'lintJs', 'js', 'html5shiv'
]);
