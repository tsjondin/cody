
var gulp = require('gulp');
var fs = require("fs");
var browserify = require("browserify");

var do_browserify = function (src, dir, target, standalone) {

	try {fs.accessSync(dir);}
	catch (e) {fs.mkdirSync(dir);}

	var target_path = dir + '/' + target;
	browserify(src, {
		standalone: standalone
	})
	.transform('babelify', {presets: ['es2015']})
	.bundle()
	.pipe(fs.createWriteStream(target_path));

};

gulp.task('cursors', function () {
	fs.readdirSync('./cursors').forEach(function (cursor) {
		if (cursor.match(/^\./)) return;
		var src_path = './cursors/' + cursor;
		var target_dir = './dist/cursors';
		do_browserify(src_path, target_dir, cursor, 'Cody.Cursors.' + cursor.replace('.js', ''));
	});
});

gulp.task('renderers', function () {
	fs.readdirSync('./renderers').forEach(function (renderer) {
		if (renderer.match(/^\./)) return;
		var src_path = './renderers/' + renderer;
		var target_dir = './dist/renderers';
		do_browserify(src_path, target_dir, renderer, 'Cody.Renderers.' + renderer.replace('.js', ''));
	});
});

gulp.task('modes', function () {
	fs.readdirSync('./modes/').forEach(function (mode) {
		if (mode.match(/^\./)) return;
		var src_path = './modes/' + mode;
		var target_dir = './dist/modes';
		do_browserify(src_path, target_dir, mode, 'Cody.Modes.' + mode.replace('.js', ''));
	});
})

gulp.task('core', function () {
	do_browserify('./index.js', './dist', 'cody.js', 'Cody');
});

gulp.task('default', ['core', 'modes', 'renderers', 'cursors']);
gulp.task('watch', function () {

	gulp.watch(['./renderers/*.js', '!./renderers/*.swp'], ['renderers']);
	gulp.watch(['./cursors/*.js', '!./cursors/*.swp'], ['cursors']);
	gulp.watch(['./src/*.js', '!*.swp'], ['core']);
	gulp.watch(['./index.js'], ['core']);
	gulp.watch(['./modes/*.js', '!*.swp'], ['modes']);

});
