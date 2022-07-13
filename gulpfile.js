const gulp = require("gulp");

gulp.task("client", () => {
	return gulp
		.src("./client/dist/**/*")
		.pipe(gulp.dest("./deploy/client/dist"));
});
gulp.task("server", () => {
	return gulp
		.src("./server/dist/**/*")
		.pipe(gulp.dest("./deploy/server/dist"));
});
gulp.task("server-data", () => {
	return gulp
		.src("./server/data/**/*")
		.pipe(gulp.dest("./deploy/server/data"));
});

gulp.task("default", gulp.series("client", "server", "server-data"));
