var gulp = require('gulp');
	 
gulp.task('default',['build']);

gulp.task('build');

gulp.task('pages', ['build'], function(done){
	var exec = require('child_process').exec;
	
	exec('git push github gh-pages', function(err, stdout, stderr) {
		return done(err);
	});
	
});

gulp.once('stop', function() {
	process.exit(0);
});

module.exports = gulp;