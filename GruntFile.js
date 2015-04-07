/**
 * Created by prandutt on 4/7/2015.
 */


module.exports = function (grunt) {
    var gulp = require('gulp');
    var usemin = require('gulp-usemin');
    var uglify = require('gulp-uglify');
    var rev = require('gulp-rev');
    require('load-grunt-tasks')(grunt);

    var init ={

        gulp: {
            min: function () {
                var dest = gulp.dest('./Dist/');
                return gulp.src(['./src/signalrService.js'])
                    .pipe(uglify({
                            mangle: true,
                            compress: true
                        }))
                    .pipe(dest);
            }
        }
    }
    grunt.initConfig(init);


    grunt.registerTask('build', ['gulp:min']);
}