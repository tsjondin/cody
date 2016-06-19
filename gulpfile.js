
var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");

gulp.task('cursors', function () {
	fs.readdirSync('./cursors').forEach(function (cursor) {

		if (cursor.match(/^\./)) return;

		var src_path = './cursors/' + cursor;
		var target_dir = './dist/cursors';
		var target_path = './dist/cursors/' + cursor;

		try {
			fs.accessSync(target_dir);
		} catch (e) {
			fs.mkdirSync(target_dir);
		}

		browserify(src_path, {
			standalone: 'Cody.Cursors.' + cursor.replace('.js', '')
		})
			.transform("babelify", {presets: ["es2015"]})
			.bundle()
			.pipe(fs.createWriteStream(target_path));

	});
});

gulp.task('renderers', function () {
	fs.readdirSync('./renderers').forEach(function (renderer) {

		if (renderer.match(/^\./)) return;

		var src_path = './renderers/' + renderer;
		var target_dir = './dist/renderers';
		var target_path = './dist/renderers/' + renderer;

		try {
			fs.accessSync(target_dir);
		} catch (e) {
			fs.mkdirSync(target_dir);
		}

		browserify(src_path, {
			standalone: 'Cody.Renderers.' + renderer.replace('.js', '')
		})
			.transform("babelify", {presets: ["es2015"]})
			.bundle()
			.pipe(fs.createWriteStream(target_path));

	});
});

gulp.task('modes', function () {
	fs.readdirSync('./modes/').forEach(function (mode) {

		if (mode.match(/^\./)) return;

		var src_path = './modes/' + mode;
		var target_dir = './dist/modes';
		var target_path = './dist/modes/' + mode;

		try {
			fs.accessSync(target_dir);
		} catch (e) {
			fs.mkdirSync(target_dir);
		}

		browserify(src_path, {
			standalone: 'Cody.Modes.' + mode.replace('.js', '')
		})
			.transform("babelify", {presets: ["es2015"]})
			.bundle()
			.pipe(fs.createWriteStream(target_path));

	});
})

gulp.task('core', function () {

	browserify("./index.js", {
		standalone: 'Cody'
	})
		.transform("babelify", {presets: ["es2015"]})
		.bundle()
		.pipe(fs.createWriteStream("./dist/cody.js"));

});

gulp.task('default', function () {

	gulp.watch(['./renderers/*.js', '!./renderers/*.swp'], ['renderers']);
	gulp.watch(['./cursors/*.js', '!./cursors/*.swp'], ['cursors']);
	gulp.watch(['./src/*.js', '!*.swp'], ['core']);
	gulp.watch(['./index.js'], ['core']);
	gulp.watch(['./modes/*.js', '!*.swp'], ['modes']);

});
