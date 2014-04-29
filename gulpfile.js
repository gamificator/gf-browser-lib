var gulp = require('gulp');
	 
gulp.task('default',['build']);

gulp.task('build');

gulp.task('pages', ['build'], function(done){
	var git = require('gulp-git');
	
	git.push('github', 'gh-pages')
	.end();
	
	done();
	
});

gulp.once('stop', function() {
	process.exit(0);
});

module.exports = gulp;