var gulp = require('gulp');
var sassCompiler = require('sass');
var sass = require('gulp-sass')(sassCompiler);
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream'); // required to dest() for browserify
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var notifier = require('node-notifier');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var babel = require('gulp-babel');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var htmlmin = require('gulp-htmlmin');
var { deleteAsync: del } = require('del');
var replace = require('gulp-replace');
var buffer = require('vinyl-buffer');

gulp.task('sass', function () {
	return gulp.src('./assets/sass/main.scss')
	.pipe(sourcemaps.init())
		.pipe(sass({
			silenceDeprecations: ['legacy-js-api', 'import']
		}).on('error', sass.logError)) // .on('error', sass.logError) prevents gulp from crashing when saving a typo or syntax error
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./assets/sass'))
	.pipe(browserSync.stream()); // causes injection of styles on save
});

function initBrowserSync() {
	browserSync.init({
		open: true,
		server: {
			baseDir: "./",
		}
	});
}

gulp.task('sync', gulp.series('sass', initBrowserSync));

var vendors = {
	merge: [
		'./assets/vendors/js/d3.v5.min.js'
	]
};

gulp.task('vendors', function() {
	return gulp.src(vendors.merge)
		.pipe(concat('vendors.js'))
		.pipe(gulp.dest('./assets/vendors/js/'));
});

gulp.task('javascript', function() {
		
	var bundleStream = browserify('./assets/js/main.js')
		.transform("babelify", {presets: ["@babel/preset-env"]})
		.bundle()
		.on('error', function(err) {
			console.log(err.stack);
			notifier.notify({
				'title': 'Browserify Compilation Error',
				'message': err.message
			});
			this.emit('end');
		});

	return bundleStream
		.pipe(source('main.js'))
		.pipe(rename('bundle.js'))
		.pipe(gulp.dest('./assets/js/'))
		.pipe(browserSync.stream());
});

gulp.task('validateJS', function() {
	return gulp.src(['./assets/js/**/*.js', '!./assets/js/bundle.js'])
		.pipe(jshint())
		.pipe(jshint.reporter(stylish));
});

gulp.task('HTML', function() {
	return gulp.src(['./index.html'])
		.pipe(browserSync.stream()); // causes injection of html changes on save
});

gulp.task('watch', function() {
	gulp.watch('./assets/sass/**/*.scss', gulp.series('sass'));
	gulp.watch(['./assets/js/**/*.js', '!./assets/js/bundle.js'], gulp.series('javascript'));
	gulp.watch('./**/*.html', gulp.series('HTML'));
	gulp.watch(['./assets/vendors/js/*.js', '!./assets/vendors/js/vendors.js', '!./assets/vendors/js/vendors.min.js'], gulp.series('vendors'));
});

// Production Build Tasks - Output to activity_1_and_activity_2/dist
gulp.task('clean:dist', function() {
	return del(['activity_1_and_activity_2/dist']);
});

gulp.task('build:js', function() {
	var bundleStream = browserify('./assets/js/main.js')
		.transform("babelify", {presets: ["@babel/preset-env"]})
		.bundle()
		.on('error', function(err) {
			console.log(err.stack);
			notifier.notify({
				'title': 'Browserify Compilation Error',
				'message': err.message
			});
			this.emit('end');
		});

	return bundleStream
		.pipe(source('main.js'))
		.pipe(buffer())
		.pipe(rename('bundle.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/assets/js/'));
});

gulp.task('build:css', function() {
	return gulp.src('./assets/sass/main.scss')
		.pipe(sass({
			silenceDeprecations: ['legacy-js-api', 'import'],
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(rename('main.css'))
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/assets/css/'));
});

gulp.task('build:vendors', function() {
	return gulp.src(vendors.merge)
		.pipe(concat('vendors.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/assets/vendors/js/'));
});

gulp.task('build:html-activity', function() {
	// Activity 1 & 2 index.html - update paths to be relative to dist folder
	return gulp.src('./activity_1_and_activity_2/index.html')
		.pipe(replace('../assets/sass/main.css', 'assets/css/main.css'))
		.pipe(replace('../assets/vendors/js/vendors.js', 'assets/vendors/js/vendors.js'))
		.pipe(replace('../assets/js/bundle.js', 'assets/js/bundle.js'))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/'));
});

gulp.task('build:copy', function() {
	// Copy activity CSV files
	var activityCsv = gulp.src('./activity_1_and_activity_2/*.csv')
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/'));
	
	// Copy and minify activity style.css (if it exists and is used)
	var activityCss = gulp.src('./activity_1_and_activity_2/style.css')
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(gulp.dest('./activity_1_and_activity_2/dist/'));
	
	return Promise.all([activityCsv, activityCss]);
});

// Production Build Task
gulp.task('build', gulp.series(
	'clean:dist',
	'build:vendors',
	'build:js',
	'build:css',
	'build:html-activity',
	'build:copy'
));

// Default Task
gulp.task('default', gulp.series('vendors', 'javascript', 'sass', gulp.parallel('watch', 'sync')));