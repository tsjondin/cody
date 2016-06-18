
var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");

gulp.task('default', function () {

	browserify("./index.js")
		.transform("babelify", {presets: ["es2015"]})
		.bundle()
		.pipe(fs.createWriteStream("./dist/cody.js"));

	fs.readdirSync('./modes/').forEach(function (mode) {

		var src_path = './modes/' + mode + '/index.js';
		var target_dir = './dist/modes/' + mode;
		var target_path = './dist/modes/' + mode + '/index.js';

		try {
			fs.accessSync(target_dir);
		} catch (e) {
			fs.mkdirSync(target_dir);
		}

		browserify(src_path)
			.transform("babelify")
			.bundle()
			.pipe(fs.createWriteStream(target_path));

	});

})
