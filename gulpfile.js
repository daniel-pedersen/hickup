var gulp = require("gulp")
var babel = require("gulp-babel")
var chmod = require("gulp-chmod")

gulp.task("default", function () {
  gulp.src("hickup.js")
    .pipe(babel())
    .pipe(chmod(755))
    .pipe(gulp.dest("dist/"))
})
