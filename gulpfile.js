var gulp = require("gulp")
var babel = require("gulp-babel")

gulp.task("default", function () {
  gulp.src("hickup.js")
    .pipe(babel())
    .pipe(gulp.dest("dist/"))
})
