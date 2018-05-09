var gulp = require("gulp");
var gulp_ngdocs = require("gulp-ngdocs");

gulp.task("docs",function(){
	return gulp.src(["./app/js/**/*.js"])
		.pipe(gulp_ngdocs.process())
		.pipe(gulp.dest('./docs'));
});




