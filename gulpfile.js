const gulp = require("gulp");
const { execSync, exec } = require("child_process");

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
gulp.task("config-files", () => {
	return gulp.src(["package*.json"]).pipe(gulp.dest("./deploy/"));
});
gulp.task("setup-heroku", () => {
	execSync('echo "web: node server/dist/server.js" > deploy/Procfile');
	if (!execSync("cd deploy && git remote").toString().includes("heroku")) {
		console.log(
			"\n\n\nno heroku connection detected",
			"\nCD HERE AND CREATE A NEW HEROKU INSTANCE USING 'heroku create' AND RUN THIS COMMAND AGAIN\n\n\n"
		);
		return;
	}
	execSync("cd deploy && git add -A");
	execSync('cd deploy && git commit -m "herko-deploy"');
	return exec("cd deploy && git push heroku master ");
});

gulp.task(
	"default",
	gulp.series(
		"client",
		"server",
		"server-data",
		"config-files",
		"setup-heroku"
	)
);
