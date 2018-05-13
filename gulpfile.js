const gulp = require("gulp");
const gulp_ngdocs = require("gulp-ngdocs");

gulp.task("docs",function(){
	return gulp.src(["./app/js/**/*.js"])
		.pipe(gulp_ngdocs.process())
		.pipe(gulp.dest('./docs'));
});

const connect = require('gulp-connect');

gulp.task('connect', function() {
    connect.server({
        root: 'app',
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['./app/**/**/**'], ['reload']);
});
gulp.task("reload",()=>{
	gulp.src("app").pipe(connect.reload());
});

gulp.task('default', ['connect', 'watch']);