var gulp = require('gulp'); 


gulp.task('copy-res', function() {
  return gulp.src('./src/client/**')
    .pipe(gulp.dest('./dist/client'));
});


gulp.task('copy-views', function() {
  return gulp.src('./src/views/**')
    .pipe(gulp.dest('./dist/views'));
});

gulp.task('default', gulp.parallel('copy-views','copy-res'))
