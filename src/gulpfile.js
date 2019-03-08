// GULP------------------------------------------//
var gulp              = require('gulp');
var sourcemaps        = require('gulp-sourcemaps');
var concat            = require('gulp-concat');
var sass              = require('gulp-sass');
var cleanCSS          = require('gulp-clean-css');
var plumber           = require('gulp-plumber');
var autoprefixer      = require('gulp-autoprefixer');
var uglify            = require('gulp-uglify-es').default;
var iconfont          = require('gulp-iconfont');
var iconfontCss       = require('gulp-iconfont-css');
var babel             = require('gulp-babel');
var buffer            = require('vinyl-buffer');
var source            = require('vinyl-source-stream')
var browserify        = require('browserify')
var babelify          = require('babelify')

// CSS------------------------------------------//
var inputFiles_css    = 'sass/index.scss';
var outputFolder_css  = '../dist/css';
var outputFile_css    = 'bundle.css';
var compiled_css      = '../dist/css/bundle.css';
// JS ------------------------------------------//
var inputFiles_js     = ['js/regular/*.js'];
var outputFolder_js   = '../dist/js';
var outputFile_js     = '../dist/js/bundle.js';

// GULP TASKS ------------------------------------------//

//grouped tasks ------------------------------------------//

// development
gulp.task('dev', ['scss', 'javascript'], function() {
  gulp.watch('./sass/**/*', ['scss']);
  gulp.watch('./js/**/*', ['javascript']);
});
gulp.task('dev--modular-js', ['scss', 'modular-js'], function() {
  gulp.watch('./sass/**/*', ['scss']);
  gulp.watch('./js/**/*', ['modular-js']);
});
// production
gulp.task('production', ['scss', 'autoprefixer', 'modular-js--production'], function() {
  console.log('### production processing completed ###')
});

//individual tasks ------------------------------------------//

//scss
gulp.task('scss', function() {
  return gulp.src(inputFiles_css)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(concat(outputFile_css))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(outputFolder_css))
});

//autoprefixer
gulp.task('autoprefixer', () =>
    gulp.src(compiled_css)
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
          browsers: ['last 3 versions'],
          cascade: false,
          grid: "autoplace",
        }))
        .pipe(concat(outputFile_css))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(outputFolder_css))
);

//javascript
gulp.task('javascript', function() {
  return gulp.src(inputFiles_js)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputFolder_js));
});

function js() {
  return gulp.src(inputFiles_js)
    .pipe(sourcemaps.init())
    .pipe(concat('bundle.js'))
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outputFolder_js));
};
//modular js
const files_es6 = [
  {in: './js/index.js', out: 'modular-bundle.js'},
]
gulp.task('modular-js', () => {
  js()
  // need more entries? Move it to function and ForEach files_es6[] (todo, later when it will by needed)
  return browserify({entries: files_es6[0].in, debug: false})
      .transform(babelify, {
          presets: ['@babel/env', '@babel/react'],
          sourceMaps: false,
      })
      .bundle()
      .on('error', function(err){
          console.log(err.stack)
      })
      .pipe(plumber())
      .pipe(source(files_es6[0].out))
      .pipe(buffer())
      .pipe(gulp.dest(outputFolder_js))
});
gulp.task('modular-js--production', () => {
  js()
  // need more entries? Move it to function and ForEach files_es6[] (todo, later when it will by needed)
  return browserify({entries: files_es6[0].in, debug: true})
      .transform(babelify, {
          presets: ['@babel/env', '@babel/react'],
          sourceMaps: false,
      })
      .bundle()
      .on('error', function(err){
          console.log(err.stack)
      })
      .pipe(plumber())
      .pipe(source(files_es6[0].out))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(outputFolder_js))
});

//javascript compresss
gulp.task("compress", function () {
  return gulp.src(outputFile_js)
      .pipe(uglify())
      .pipe(gulp.dest(outputFolder_js));
});

//iconfont (make a font out of svg files)
var runTimestamp        = Math.round(Date.now()/1000);
var fontName            = 'icons';
var inputFolder_svg     = 'svg/*.svg';
var iconTemplateFile    = 'sass/svg-icon-templates/_icons_template.scss';
var iconTargetPath      = '_icons_file.scss';
var iconFontTargetPath  = '../fonts/icons/';
var iconFontDistFolder  = '../dist/fonts/icons/';

gulp.task('iconfont', function(){
    return gulp.src(inputFolder_svg) // Source folder containing the SVG images
        .pipe(iconfontCss({
            fontName: fontName, // The name that the generated font will have
            path: iconTemplateFile, // The path to the template that will be used to create the SASS/LESS/CSS file
            targetPath: iconTargetPath, // The path where the file will be generated
            fontPath: iconFontTargetPath, // The path to the icon font file
            cssClass: 'icon'
        }))
        .pipe(iconfont({
            prependUnicode: false, // Recommended option
            fontName: fontName, // Name of the font
            formats: ['ttf', 'eot', 'woff', 'otf'], // The font file formats that will be created
            normalize: true,
            timestamp: runTimestamp // Recommended to get consistent builds when watching files
        }))
        .pipe(gulp.dest(iconFontDistFolder));
});
