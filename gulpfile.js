const gulp = require("gulp");
const { execSync, exec } = require("child_process");

gulp.task("client", () => {
	execSync("npx gulp -f client/gulpfile.js build");
	return gulp
		.src("./client/dist/**/*")
		.pipe(gulp.dest("./deploy/client/dist"));
});
gulp.task("server", () => {
	execSync("npx tsc -p server/tsconfig.json");
	return gulp
		.src("./server/dist/**/*")
		.pipe(gulp.dest("./deploy/server/dist"));
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
	try {
		execSync('cd deploy && git commit -m "herko-deploy"');
	} catch {
		console.log("nothing new");
	}
	return exec("cd deploy && git push heroku master ");
});

gulp.task(
	"default",
	gulp.series("client", "server", "config-files", "setup-heroku")
);
