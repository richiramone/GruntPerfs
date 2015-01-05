
module.exports = function(grunt) {
  grunt.initConfig({
    uglify: {
      options: {
        mangle: {
          except: ['jQuery', '$', 'Modernizr']
        }
      },
      my_target: {
        files: [{
            expand: true,
            cwd: 'js',
            src: '**/*.js',
            dest: 'js/',
            ext: '.min.js'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
}