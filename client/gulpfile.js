const gulp = require("gulp");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const webpack = require("webpack-stream");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();
const { exec } = require("child_process");

const webpackConfig = require("./webpack.config.js");

// Removes previous dist
gulp.task("start", () => {
	return gulp.src("./dist", { allowEmpty: true }).pipe(clean());
});

// Creates js bundle from several js files
gulp.task("pack", () => {
	return webpack(webpackConfig).pipe(gulp.dest("./dist"));
});

// Converts scss to css
gulp.task("scss", () => {
	return gulp.src("./src/**/*.scss").pipe(sass()).pipe(gulp.dest("./dist"));
});

// Transfers index
gulp.task("index", () => {
	return gulp
		.src(["./src/index.html", "./src/favicon.ico"])
		.pipe(gulp.dest("./dist"));
});

// Transfers media
gulp.task("media", () => {
	return gulp.src(["./src/media/*"]).pipe(gulp.dest("./dist/media"));
});

// Browser Sync
gulp.task("browser-sync", () => {
	browserSync.init({
		browser: "default",
		port: 4000,
		server: { baseDir: "./dist" },
	});
});

// Browser Sync live reload
gulp.task("browser-sync-watch", () => {
	gulp.watch("./dist/styles.css").on("change", browserSync.reload);
	gulp.watch("./dist/app.js").on("change", browserSync.reload);
	gulp.watch("./dist/index.html").on("change", browserSync.reload);
});

// Watch scss files
gulp.task("watch-scss", () => {
	return gulp.watch("./src/**/*.scss", gulp.series("scss"));
});

// Watch html files
gulp.task("watch-html", () => {
	return gulp.watch("./src/index.html", gulp.series("index"));
});

// Watch media files
gulp.task("watch-media", () => {
	return gulp.watch("./src/media/*", gulp.series("media"));
});

// Watch tsc files
gulp.task("watch-tsc", () => {
	return gulp.watch("./dist/tsc/**/*.js", gulp.series("build"));
});

// Initial ts compile
gulp.task("tsc", (cb) => {
	exec("tsc", (err, msg) => {
		cb();
	});
});

// Watch ts files and recompile
gulp.task("tsc-w", () => {
	exec("tsc -w");
});

gulp.task(
	"build",
	gulp.series("start", "scss", "index", "media", "tsc", "pack")
);

// Run all together
gulp.task(
	"default",
	gulp.series(
		"build",
		gulp.parallel(
			"browser-sync",
			"browser-sync-watch",
			"watch-scss",
			"watch-html",
			"watch-media",
			"watch-tsc",
			"tsc-w"
		)
	)
);
