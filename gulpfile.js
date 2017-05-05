var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('default', function() {
    return gulp.src('banner.js')
        .pipe(minify())
        .pipe(gulp.dest('./'));
});

gulp.task('watch', ['default'], function(){
	gulp.watch('banner.js',['default']);
});