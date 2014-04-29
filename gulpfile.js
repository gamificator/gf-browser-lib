var gulp = require('gulp'),
    exec = require('child_process').exec;

gulp.task('default',['build']);

gulp.task('build');

gulp.task('test',['build'], function(done) {

	var packageJson = require('./package');

	exec(packageJson.scripts.test, done);

	return;

});

gulp.once('stop', function() {
	process.exit(0);
});

module.exports = gulp;