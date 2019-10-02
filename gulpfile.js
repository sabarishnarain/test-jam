var gulp = require('gulp'); 

gulp.task('copy-res', function() {
  return gulp.src('./src/client/**')
    .pipe(gulp.dest('./dist/client'));
});

gulp.task('default', gulp.parallel('copy-res'));
