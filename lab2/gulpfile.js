var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
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
var replace = require('gulp-replace');

gulp.task('sass', function () {
	return gulp.src('./assets/sass/main.scss')
	.pipe(sourcemaps.init())
		.pipe(sass().on('error', function(err) {
			console.error('Sass compilation error:', err.message);
			this.emit('end');
		})) // prevents gulp from crashing when saving a typo or syntax error
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./assets/sass'))
	.pipe(browserSync.stream()); // causes injection of styles on save
});

gulp.task('sync', gulp.series('sass', function(done) {
	browserSync.init({
		open: true,
		server: {
			baseDir: "./",
		},
		ui: false  // Disable UI to avoid the eazy-logger compatibility issue with Node 22
	});
	done();
}));

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

gulp.task('watch', function(done) {
	gulp.watch('./assets/sass/**/*.scss', gulp.series('sass'));
	gulp.watch(['./assets/js/**/*.js', '!./assets/js/bundle.js'], gulp.series('javascript'));
	gulp.watch('./**/*.html', gulp.series('HTML'));
	gulp.watch(['./assets/vendors/js/*.js', '!./assets/vendors/js/vendors.min.js'], gulp.series('vendors'));
	done();
});

// Build task subtasks - define these first
gulp.task('build:activity2:copy', function() {
	// Copy activity_2 files directly to dist root and fix paths in HTML
	return gulp.src('activity_2/**/*', { base: 'activity_2' })
		.pipe(replace('../assets/', './assets/'))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:activity2:fix-html', function() {
	// Add style.css link to index.html (scatterplot.js not needed - bundle.js handles it)
	return gulp.src('dist/index.html')
		.pipe(replace(
			'<link rel="stylesheet" href="./assets/sass/main.css">',
			'<link rel="stylesheet" href="./assets/sass/main.css">\n\t<link rel="stylesheet" href="./style.css">'
		))
		.pipe(gulp.dest('dist'));
});

gulp.task('build:activity2:fix-csv-path', function() {
	// Fix CSV path in bundle.js (change '../activity_2/' to './')
	return gulp.src('dist/assets/js/bundle.js')
		.pipe(replace('../activity_2/baseball_hr_leaders.csv', './baseball_hr_leaders.csv'))
		.pipe(gulp.dest('dist/assets/js'));
});

gulp.task('build:activity2:assets', function() {
	// Copy assets files maintaining their structure
	return gulp.src([
		'assets/sass/main.css',
		'assets/vendors/js/vendors.js',
		'assets/js/bundle.js'
	], { base: '.' })
		.pipe(gulp.dest('dist'));
});

// Main build task to export activity_2 with all dependencies at root level
gulp.task('build:activity2', gulp.series('vendors', 'javascript', 'sass', 'build:activity2:copy', 'build:activity2:assets', 'build:activity2:fix-html', 'build:activity2:fix-csv-path'));

// Default Task
gulp.task('default', gulp.series('vendors', 'javascript', 'sass', gulp.parallel('watch', 'sync')));