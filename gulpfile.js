var gulp = require('gulp');
	 
gulp.task('default',['build']);

gulp.task('build');

gulp.once('stop', function() {
	process.exit(0);
});

module.exports = gulp;